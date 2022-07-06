/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { ALERTING_PLUGIN_NAME } from '../../../utils/plugins/alerting-dashboards-plugin/constants';
import { BASE_PATH } from '../../../utils/base_constants';

const SAMPLE_CLUSTER_METRICS_HEALTH_MONITOR =
  'sample_cluster_metrics_health_monitor';
const SAMPLE_CLUSTER_METRICS_NODES_STATS_MONITOR =
  'sample_cluster_metrics_nodes_stats_monitor';
const SAMPLE_TRIGGER = 'sample_trigger';

describe('ClusterMetricsMonitor', () => {
  before(() => {
    // FIXME: Temporarily removing destination creation to resolve flakiness. It seems deleteAllDestinations()
    //  is executing mid-testing. Need to further investigate a more ideal solution. Destination creation should
    //  ideally take place in the before() block, and clearing should occur in the after() block.
    // cy.createDestination(sampleDestination);

    // Load sample data
    cy.loadSampleEcommerceData();
  });

  beforeEach(() => {
    // Set welcome screen tracking to false
    localStorage.setItem('home:welcome:show', 'false');

    // Visit Alerting OpenSearch Dashboards
    cy.visit(`${BASE_PATH}/app/${ALERTING_PLUGIN_NAME}#/monitors`);

    // Common text to wait for to confirm page loaded, give up to 20 seconds for initial load
    cy.contains('Create monitor', { timeout: 20000 });
  });

  describe('can be created', () => {
    beforeEach(() => {
      cy.deleteAllMonitors();
      cy.reload();
    });

    it('for the Cluster Health API', () => {
      // Confirm empty monitor list is loaded
      cy.contains('There are no existing monitors');

      // Go to create monitor page
      cy.contains('Create monitor').click();

      // Select ClusterMetrics radio card
      cy.get('[data-test-subj="clusterMetricsMonitorRadioCard"]').click();

      // Wait for input to load and then type in the monitor name
      cy.get('input[name="name"]').type(SAMPLE_CLUSTER_METRICS_HEALTH_MONITOR);

      // Wait for the API types to load and then type in the Cluster Health API
      cy.get('[data-test-subj="clusterMetricsApiTypeComboBox"]').type(
        'cluster health{enter}'
      );

      // Confirm the Query parameters field is present and described as "optional"
      cy.contains('Query parameters - optional');
      cy.get('[data-test-subj="clusterMetricsParamsFieldText"]');

      // Press the 'Run for response' button
      cy.get('[data-test-subj="clusterMetricsPreviewButton"]').click();

      // Add a trigger
      cy.contains('Add trigger').click({ force: true });

      // Type in the trigger name
      cy.get('input[name="triggerDefinitions[0].name"]').type(SAMPLE_TRIGGER);

      // FIXME: Temporarily removing destination creation to resolve flakiness. It seems deleteAllDestinations()
      //  is executing mid-testing. Need to further investigate a more ideal solution. Destination creation should
      //  ideally take place in the before() block, and clearing should occur in the after() block.
      // // Type in the action name
      // cy.get('input[name="triggerDefinitions[0].actions.0.name"]').type(SAMPLE_ACTION);
      //
      // // Click the combo box to list all the destinations
      // // Using key typing instead of clicking the menu option to avoid occasional failure
      // cy.get('div[name="triggerDefinitions[0].actions.0.destination_id"]')
      //   .click({ force: true })
      //   .type('{downarrow}{enter}');

      // Click the create button
      cy.get('button').contains('Create').click();

      // Confirm we can see only one row in the trigger list by checking <caption> element
      cy.contains('This table contains 1 row');

      // Confirm we can see the new trigger
      cy.contains(SAMPLE_TRIGGER);

      // Go back to the Monitors list
      cy.get('a').contains('Monitors').click();

      // Confirm we can see the created monitor in the list
      cy.contains(SAMPLE_CLUSTER_METRICS_HEALTH_MONITOR);
    });

    it('for the Nodes Stats API', () => {
      // Go to create monitor page
      cy.contains('Create monitor').click();

      // Select ClusterMetrics radio card
      cy.get('[data-test-subj="clusterMetricsMonitorRadioCard"]').click();

      // Wait for input to load and then type in the monitor name
      cy.get('input[name="name"]').type(
        SAMPLE_CLUSTER_METRICS_NODES_STATS_MONITOR
      );

      // Wait for the API types to load and then type in the Cluster Health API
      cy.get('[data-test-subj="clusterMetricsApiTypeComboBox"]').type(
        'nodes stats{enter}'
      );

      // Confirm the Query parameters field is not present
      cy.contains('Query parameters').should('not.exist');
      cy.get('[data-test-subj="clusterMetricsParamsFieldText"]').should(
        'not.exist'
      );

      // Press the 'Run for response' button
      cy.get('[data-test-subj="clusterMetricsPreviewButton"]').click();

      // Add a trigger
      cy.contains('Add trigger').click({ force: true });

      // Type in the trigger name
      cy.get('input[name="triggerDefinitions[0].name"]').type(SAMPLE_TRIGGER);

      // FIXME: Temporarily removing destination creation to resolve flakiness. It seems deleteAllDestinations()
      //  is executing mid-testing. Need to further investigate a more ideal solution. Destination creation should
      //  ideally take place in the before() block, and clearing should occur in the after() block.
      // // Type in the action name
      // cy.get('input[name="triggerDefinitions[0].actions.0.name"]').type(SAMPLE_ACTION);
      //
      // // Click the combo box to list all the destinations
      // // Using key typing instead of clicking the menu option to avoid occasional failure
      // cy.get('div[name="triggerDefinitions[0].actions.0.destination_id"]')
      //   .click({ force: true })
      //   .type('{downarrow}{enter}');

      // Click the create button
      cy.get('button').contains('Create').click();

      // Confirm we can see only one row in the trigger list by checking <caption> element
      cy.contains('This table contains 1 row');

      // Confirm we can see the new trigger
      cy.contains(SAMPLE_TRIGGER);

      // Go back to the Monitors list
      cy.get('a').contains('Monitors').click();

      // Confirm we can see the created monitor in the list
      cy.contains(SAMPLE_CLUSTER_METRICS_NODES_STATS_MONITOR);
    });
  });

  after(() => {
    // Delete all monitors and destinations
    // cy.deleteAllMonitors();
    // Delete sample data
    // cy.deleteIndexByName(`${ALERTING_INDEX.SAMPLE_DATA_ECOMMERCE}`);
  });
});