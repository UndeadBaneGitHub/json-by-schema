import { test, expect } from '@playwright/test';

async function clickPropertyItem(page, name) {
  const item = page
    .locator('.json-by-schema ul li h3')
    .filter({ hasText: new RegExp(`^${name}$`) })
    .first();
  await item.click();
}

test.describe('json-by-schema critical paths & visual checks', () => {
  test('renders demo in light and dark mode with theme presets and no console errors', async ({
    page,
  }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('404')) {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await expect(page.getByText('serviceName').first()).toBeVisible();
    await expect(page.getByText('Generated JSON')).toBeVisible();

    // Ensure no horizontal overflow on desktop viewport
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);

    // Visual snapshot in default iOS light mode
    await expect(page).toHaveScreenshot('demo-ios-light.png');

    // Toggle dark mode via header switch
    const darkSwitch = page.getByRole('switch', { name: 'Toggle dark mode' }).first();
    await darkSwitch.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(page).toHaveScreenshot('demo-ios-dark.png');

    // Switch back to light mode and test theme preset switching
    await darkSwitch.click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    await page.getByRole('button', { name: 'Nomad' }).click();
    await page.getByRole('button', { name: 'iOS' }).click();

    expect(errors).toEqual([]);
  });

  test('nullable type-array pattern property (x-kappa) full lifecycle & type switching', async ({
    page,
  }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');
    await expect(page.getByText('serviceName').first()).toBeVisible();

    // 1. Update schema so patternProperties ^x- allows ["string", "integer", "null"]
    await page.evaluate(() => {
      const editor = window.ace.edit('demo-schema-editor');
      const parsed = JSON.parse(editor.getValue());
      parsed.patternProperties = {
        '^x-': {
          type: ['string', 'integer', 'null'],
          description: 'Nullable multi-type pattern property',
        },
      };
      editor.setValue(JSON.stringify(parsed, null, 2), -1);
    });
    const updateEditorBtn = page.getByRole('button', { name: 'Update editor' });
    await expect(updateEditorBtn).toBeEnabled();
    await updateEditorBtn.click();

    // 2. Create new property x-kappa
    await page.getByRole('button', { name: 'Add Item' }).click();
    const nameInput = page.getByPlaceholder(/property name/i);
    await nameInput.fill('x-kappa');
    await page.locator('input[type="submit"][value="Save"]').click();

    // 3. Verify "null" is disabled in One of dropdown, pick "string", set "KAPPA", Save
    const oneOfInput = page.getByRole('combobox').first();
    await oneOfInput.click();
    const nullOption = page.getByRole('option', { name: 'null' });
    await expect(nullOption).toHaveAttribute('aria-disabled', 'true');
    await page.getByRole('option', { name: 'string' }).click();

    const textarea = page.locator('.json-by-schema textarea').first();
    await expect(textarea).toBeVisible();
    await textarea.fill('KAPPA');
    await page.locator('input[type="submit"][value="Save"]').click();

    // 4. Set to null and Save
    await page.getByRole('button', { name: 'Set to null' }).click();
    await page.locator('input[type="submit"][value="Save"]').click();

    // 5. Pick another top-level property ("serviceName")
    await clickPropertyItem(page, 'serviceName');
    await expect(page.locator('.json-by-schema textarea').first()).toHaveValue(
      'my-service',
    );

    // 6. Return to x-kappa: null must be displayed as placeholder, and switching to integer must work
    await clickPropertyItem(page, 'x-kappa');
    const kappaTextarea = page.locator('.json-by-schema textarea').first();
    await expect(kappaTextarea).toHaveValue('');
    await expect(kappaTextarea).toHaveAttribute('placeholder', 'null');

    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: 'integer' }).click();

    const numInput = page.locator('.json-by-schema input[type="number"]').first();
    await expect(numInput).toBeVisible();
    await numInput.fill('123');
    await page.locator('input[type="submit"][value="Save"]').click();

    // 7. Switch back to "string": 123 should be placeholder with no type-mismatch validation error
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: 'string' }).click();
    const backToStringTa = page.locator('.json-by-schema textarea').first();
    await expect(backToStringTa).toHaveValue('');
    await expect(backToStringTa).toHaveAttribute('placeholder', '123');
    await expect(page.getByText(/is not of a type/i)).toHaveCount(0);

    expect(errors).toEqual([]);
  });

  test('explicit Save and unsaved-changes navigation guard', async ({ page }) => {
    await page.goto('/');
    await clickPropertyItem(page, 'serviceName');

    const ta = page.locator('.json-by-schema textarea').first();
    await ta.fill('unsaved-edit');

    // Navigating away triggers unsaved changes modal
    await clickPropertyItem(page, 'port');
    await expect(page.getByText('You have unsaved changes.')).toBeVisible();

    // Cancel keeps us on serviceName with the unsaved edit
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByText('You have unsaved changes.')).toHaveCount(0);
    await expect(page.locator('.json-by-schema textarea').first()).toHaveValue(
      'unsaved-edit',
    );

    // Proceed and undo changes navigates to port
    await clickPropertyItem(page, 'port');
    await expect(page.getByText('You have unsaved changes.')).toBeVisible();
    await page.getByRole('button', { name: 'Proceed and undo changes' }).click();
    await expect(page.locator('.json-by-schema input[type="number"]').first()).toHaveValue(
      '8080',
    );
  });

  test('deep multi-level navigation across arrays of objects and anyOf branches', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. 3-level deep navigation: endpoints (array) -> Item #1 (object) -> url / retries
    await clickPropertyItem(page, 'endpoints');
    await clickPropertyItem(page, 'Item #1');
    await clickPropertyItem(page, 'url');

    await expect(page.locator('code')).toHaveText('endpoints/0/url');
    const urlTa = page.locator('.json-by-schema textarea').first();
    await expect(urlTa).toHaveValue('https://api.example.com/health');
    await urlTa.fill('https://api.example.com/v2/health');
    await page.locator('input[type="submit"][value="Save"]').click();

    await clickPropertyItem(page, 'retries');
    await expect(page.locator('code')).toHaveText('endpoints/0/retries');
    const retriesInput = page.locator('.json-by-schema input[type="number"]').first();
    await expect(retriesInput).toHaveValue('3');
    await retriesInput.fill('5');
    await page.locator('input[type="submit"][value="Save"]').click();

    // 2. Add a second object item to endpoints and configure its nested properties
    const endpointsPanelAddBtn = page.getByRole('button', { name: 'Add Item' }).nth(1);
    await endpointsPanelAddBtn.click();
    await clickPropertyItem(page, 'Item #2');
    await clickPropertyItem(page, 'url');
    await expect(page.locator('code')).toHaveText('endpoints/1/url');
    await page.locator('.json-by-schema textarea').first().fill('https://api.example.com/v2/metrics');
    await page.locator('input[type="submit"][value="Save"]').click();

    // 3. Navigate into anyOf property (notificationTarget), switch branch to Webhook object, edit nested child
    await clickPropertyItem(page, 'notificationTarget');
    const anyOfCombo = page.getByRole('combobox').first();
    await anyOfCombo.click();
    await page.getByRole('option', { name: 'Webhook' }).click();

    await clickPropertyItem(page, 'webhookUrl');
    const webhookTa = page.locator('.json-by-schema textarea').first();
    await webhookTa.fill('https://hooks.example.com/notify');
    await page.locator('input[type="submit"][value="Save"]').click();

    // Verify all deep edits are reflected in Generated JSON
    const outputJson = await page.evaluate(() =>
      JSON.parse(window.ace.edit('demo-output-json').getValue()),
    );
    expect(outputJson.endpoints[0].url).toBe('https://api.example.com/v2/health');
    expect(outputJson.endpoints[0].retries).toBe(5);
    expect(outputJson.endpoints[1].url).toBe('https://api.example.com/v2/metrics');
    expect(outputJson.notificationTarget.webhookUrl).toBe('https://hooks.example.com/notify');
  });

  test('array items creation, drag-and-drop reordering, and removal', async ({
    page,
  }) => {
    await page.goto('/');

    // Open tags array (initially ['api', 'v1'])
    await clickPropertyItem(page, 'tags');
    const addTagBtn = page.getByRole('button', { name: 'Add Item' }).last();
    await expect(addTagBtn).toBeVisible();

    // Add Item #3 and set its value to 'v2'
    await addTagBtn.click();
    await clickPropertyItem(page, 'Item #3');
    const tagTa = page.locator('.json-by-schema textarea').first();
    await expect(tagTa).toBeVisible();
    await tagTa.fill('v2');
    await page.locator('input[type="submit"][value="Save"]').click();

    let outputJson = await page.evaluate(() =>
      JSON.parse(window.ace.edit('demo-output-json').getValue()),
    );
    expect(outputJson.tags).toEqual(['api', 'v1', 'v2']);

    // Reorder Item #1 ('api') below Item #2 ('v1') using drag handle
    const dragHandles = page.locator('.json-by-schema .cursor-grab');
    await expect(dragHandles).toHaveCount(3);

    const firstHandleBox = await dragHandles.nth(0).boundingBox();
    const secondHandleBox = await dragHandles.nth(1).boundingBox();

    await page.mouse.move(
      firstHandleBox.x + firstHandleBox.width / 2,
      firstHandleBox.y + firstHandleBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      secondHandleBox.x + secondHandleBox.width / 2,
      secondHandleBox.y + secondHandleBox.height / 2 + 25,
      { steps: 15 },
    );
    await page.mouse.up();

    await expect
      .poll(async () => {
        const json = await page.evaluate(() =>
          JSON.parse(window.ace.edit('demo-output-json').getValue()),
        );
        return json.tags;
      })
      .toEqual(['v1', 'api', 'v2']);

    // Remove the 3rd item ('v2') and verify array updates
    const removeButtons = page.getByRole('button', { name: 'Remove item' });
    await removeButtons.nth(2).click();

    outputJson = await page.evaluate(() =>
      JSON.parse(window.ace.edit('demo-output-json').getValue()),
    );
    expect(outputJson.tags).toEqual(['v1', 'api']);
  });

  test('creating new items by different patternProperties and pattern validation rules', async ({
    page,
  }) => {
    await page.goto('/');

    // Configure multiple patternProperties of different types (plus an overlapping pattern)
    await page.evaluate(() => {
      const editor = window.ace.edit('demo-schema-editor');
      const parsed = JSON.parse(editor.getValue());
      parsed.patternProperties = {
        '^x-': {
          type: 'string',
          description: 'Custom string header (^x-)',
        },
        '^num_': {
          type: 'integer',
          description: 'Numeric metric (^num_)',
        },
        '^flag_': {
          type: 'boolean',
          description: 'Feature flag (^flag_)',
        },
        '^x-dup-': {
          type: 'string',
          description: 'Overlapping pattern with ^x-',
        },
      };
      editor.setValue(JSON.stringify(parsed, null, 2), -1);
    });
    await page.getByRole('button', { name: 'Update editor' }).click();

    // Open NewPatternPropertyItem editor
    await page.getByRole('button', { name: 'Add Item' }).first().click();
    const nameInput = page.getByPlaceholder(/property name/i);
    const saveNewPropBtn = page.locator('input[type="submit"][value="Save"]').first();

    // 1. Non-matching name keeps Save disabled
    await nameInput.fill('unmatched_name');
    await expect(saveNewPropBtn).toBeDisabled();

    // 2. Existing property name shows duplicate error and disables Save
    await nameInput.fill('x-custom-header');
    await expect(saveNewPropBtn).toBeDisabled();

    // 3. Name matching two patterns (^x- and ^x-dup-) shows warning and disables Save
    await nameInput.fill('x-dup-prop');
    await expect(saveNewPropBtn).toBeDisabled();

    // 4. Create string property via ^x- pattern
    await nameInput.fill('x-trace-id');
    await expect(saveNewPropBtn).toBeEnabled();
    await saveNewPropBtn.click();

    const strTa = page.locator('.json-by-schema textarea').first();
    await expect(strTa).toBeVisible();
    await strTa.fill('trace-999');
    await page.locator('input[type="submit"][value="Save"]').click();

    // 5. Create integer property via ^num_ pattern
    await page.getByRole('button', { name: 'Add Item' }).first().click();
    await page.getByPlaceholder(/property name/i).fill('num_workers');
    await page.locator('input[type="submit"][value="Save"]').first().click();

    const intInput = page.locator('.json-by-schema input[type="number"]').first();
    await expect(intInput).toBeVisible();
    await intInput.fill('16');
    await page.locator('input[type="submit"][value="Save"]').click();

    // 6. Create boolean property via ^flag_ pattern (defaults to true, toggle to false)
    await page.getByRole('button', { name: 'Add Item' }).first().click();
    await page.getByPlaceholder(/property name/i).fill('flag_beta');
    await page.locator('input[type="submit"][value="Save"]').first().click();

    const boolSwitch = page.locator('.json-by-schema button[role="switch"]').first();
    await expect(boolSwitch).toBeVisible();
    await expect(boolSwitch).toHaveAttribute('aria-checked', 'true');
    await boolSwitch.click();
    await expect(boolSwitch).toHaveAttribute('aria-checked', 'false');
    await page.locator('input[type="submit"][value="Save"]').click();

    // Verify all 3 pattern-created properties and their types in Generated JSON
    const outputJson = await page.evaluate(() =>
      JSON.parse(window.ace.edit('demo-output-json').getValue()),
    );
    expect(outputJson['x-trace-id']).toBe('trace-999');
    expect(outputJson.num_workers).toBe(16);
    expect(outputJson.flag_beta).toBe(false);
  });

  test('filter search & clear, field validation errors, Revert Changes, Delete Value, and Revert Value', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Filter search and Clear filter
    const filterInput = page.getByPlaceholder('Filter...').first();
    await filterInput.fill('serviceName');
    await expect(
      page.locator('.json-by-schema ul li h3').filter({ hasText: /^serviceName$/ }),
    ).toHaveCount(1);
    await expect(
      page.locator('.json-by-schema ul li h3').filter({ hasText: /^port$/ }),
    ).toHaveCount(0);

    await filterInput.fill('nonexistent_xyz_property');
    await expect(page.getByText(/no items/i)).toBeVisible();

    await page.getByRole('button', { name: 'Clear filter' }).first().click();
    await expect(
      page.locator('.json-by-schema ul li h3').filter({ hasText: /^port$/ }),
    ).toHaveCount(1);

    // 2. Field validation errors (serviceName requires minLength: 2 and pattern ^[a-z0-9-]+$) & Revert Changes button
    await clickPropertyItem(page, 'serviceName');
    const ta = page.locator('.json-by-schema textarea').first();
    const saveBtn = page.locator('input[type="submit"][value="Save"]');
    const revertBtn = page.locator('input[type="button"][value="Revert Changes"]');

    await ta.fill('A');
    await expect(saveBtn).toBeDisabled();
    await expect(revertBtn).toBeEnabled();

    // Clicking Revert Changes restores original value and clears unsaved state
    await revertBtn.click();
    await expect(ta).toHaveValue('my-service');
    await expect(revertBtn).toBeDisabled();

    // Save a valid change, then use "Revert Value" on the list item to restore initialConfig
    await ta.fill('updated-service');
    await expect(saveBtn).toBeEnabled();
    await saveBtn.click();

    const serviceListItem = page
      .locator('.json-by-schema ul li')
      .filter({ has: page.locator('h3', { hasText: /^serviceName$/ }) })
      .first();
    await expect(serviceListItem).toContainText('Value: updated-service');
    await serviceListItem.getByRole('button', { name: 'Revert Value' }).click();
    await expect(serviceListItem).toContainText('Value: my-service');

    // 3. Delete Value on pattern property (x-custom-header removes it from list) and fixed property (timeoutSeconds allows Revert Value)
    const customHeaderItem = page
      .locator('.json-by-schema ul li')
      .filter({ has: page.locator('h3', { hasText: /^x-custom-header$/ }) })
      .first();
    await customHeaderItem.getByRole('button', { name: 'Delete Value' }).click();
    await expect(
      page.locator('.json-by-schema ul li h3').filter({ hasText: /^x-custom-header$/ }),
    ).toHaveCount(0);

    const timeoutItem = page
      .locator('.json-by-schema ul li')
      .filter({ has: page.locator('h3', { hasText: /^timeoutSeconds$/ }) })
      .first();
    await timeoutItem.getByRole('button', { name: 'Delete Value' }).click();

    let outputJson = await page.evaluate(() =>
      JSON.parse(window.ace.edit('demo-output-json').getValue()),
    );
    expect(outputJson['x-custom-header']).toBeUndefined();
    expect(outputJson.timeoutSeconds).toBeUndefined();

    await timeoutItem.getByRole('button', { name: 'Revert Value' }).click();
    outputJson = await page.evaluate(() =>
      JSON.parse(window.ace.edit('demo-output-json').getValue()),
    );
    expect(outputJson.timeoutSeconds).toBe(12.5);
  });

  test('enum select, numeric slider, tuple array, allOf, oneOf, Edit as JSON, and global Save/Revert', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Enum dropdown (environment: development -> production)
    await clickPropertyItem(page, 'environment');
    const enumCombo = page.locator('.json-by-schema input[role="combobox"]').first();
    await enumCombo.click();
    await page.getByRole('option', { name: 'production' }).click();
    await page.locator('input[type="submit"][value="Save"]').click();

    // 2. Numeric range slider (port: 1 - 65535)
    await clickPropertyItem(page, 'port');
    const sliderThumb = page.getByRole('slider', { name: 'Numeric value slider' });
    await expect(sliderThumb).toBeVisible();
    await sliderThumb.focus();
    await page.keyboard.press('ArrowRight');
    await page.locator('input[type="submit"][value="Save"]').click();

    // 3. Tuple array (coordinateTuple: positional Label, Latitude, Longitude)
    await clickPropertyItem(page, 'coordinateTuple');
    await expect(
      page.locator('.json-by-schema ul li h3').filter({ hasText: /^Label$/ }),
    ).toBeVisible();
    await expect(
      page.locator('.json-by-schema ul li h3').filter({ hasText: /^Latitude$/ }),
    ).toBeVisible();
    await clickPropertyItem(page, 'Label');
    const tupleLabelTa = page.locator('.json-by-schema textarea').first();
    await expect(tupleLabelTa).toHaveValue('HQ');
    await tupleLabelTa.fill('Branch');
    await page.locator('input[type="submit"][value="Save"]').click();

    // 4. allOf composed object (metadata: owner + version)
    await clickPropertyItem(page, 'metadata');
    await clickPropertyItem(page, 'owner');
    const ownerTa = page.locator('.json-by-schema textarea').first();
    await expect(ownerTa).toHaveValue('platform-team');
    await ownerTa.fill('core-team');
    await page.locator('input[type="submit"][value="Save"]').click();

    // 5. oneOf object switching (auth: API Key -> Basic Auth)
    await clickPropertyItem(page, 'auth');
    const authCombo = page.locator('.json-by-schema input[role="combobox"]').first();
    await authCombo.click();
    await page.getByRole('option', { name: 'Basic Auth' }).click();
    await clickPropertyItem(page, 'username');
    await page.locator('.json-by-schema textarea').first().fill('admin');
    await page.locator('input[type="submit"][value="Save"]').click();

    // 6. Edit as JSON mode on root panel
    const editAsJsonBtn = page.getByRole('button', { name: 'Edit as JSON' }).first();
    await editAsJsonBtn.click();
    await expect(page.locator('#json-property-editor')).toBeVisible();
    await page.getByRole('button', { name: /Stop editing as JSON/i }).first().click();
    await expect(page.locator('#json-property-editor')).toHaveCount(0);

    // 7. Global header Save / Revert changes bar
    await expect(page.getByText('Unsaved changes')).toBeVisible();
    const globalSaveBtn = page.locator('header').getByRole('button', { name: 'Save' });
    await expect(globalSaveBtn).toBeEnabled();
    await globalSaveBtn.click();
    await expect(page.getByText('Unsaved changes')).toHaveCount(0);

    const outputJson = await page.evaluate(() =>
      JSON.parse(window.ace.edit('demo-output-json').getValue()),
    );
    expect(outputJson.environment).toBe('production');
    expect(outputJson.port).toBe(8081);
    expect(outputJson.coordinateTuple[0]).toBe('Branch');
    expect(outputJson.metadata.owner).toBe('core-team');
    expect(outputJson.auth.username).toBe('admin');
  });
});
