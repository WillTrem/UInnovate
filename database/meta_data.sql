-- Insert the basic config properties into the appconfig_properties table
INSERT INTO
    meta.appconfig_properties (name, description, value_type, default_value)
VALUES
    (
        'table_view',
        'Default layout shown when selecting a table from the object menu.',
        'string',
        'list'
    ),
    (
        'visible',
        'Visibility state of a table/column.',
        'boolean',
        'true'
    ),
    (
        'editable',
        'Makes a column editable',
        'boolean',
        'false'
    ),
    (
        'display_column_as_currency',
        'Displays a column as currency type.',
        'boolean',
        'false'
    ),
    (
        'column_display_type',
        'How to display a column',
        'string',
        'text'
    ),
    (
        'metadata_view',
        'Default view when showing the metadata information of a table/column',
        'boolean',
        'false'
    ),
    (
        'details_view',
        'Visibility state of the details view for a table',
        'boolean',
        'true'
    ),
    (
        'stand_alone_details_view',
        'Visibility state of the stand alone details view for a table',
        'boolean',
        'false'
    ),
    (
        'lookup_tables',
        'List of tables that are used as lookup tables',
        'string',
        'null'
    ),
    (
        'lookup_counter',
        'Counter for the amount of tables displayed for lookup tables',
        'string',
        '0'
    );

-- ADD ANY NEW CONFIG PROPERTIES HERE
-- Insert the default column display typess for each  app_service_support column
INSERT INTO
    meta.appconfig_values (property, value, "table", "column")
SELECT
    CFP.name,
    default_value,
    C.table,
    C.column
FROM
    meta.columns as C,
    meta.appconfig_properties as CFP
WHERE
    schema = ' app_service_support'
    AND (
        CFP.name != 'table_view'
        AND CFP.name != 'details_view'
        AND CFP.name != 'stand_alone_details_view'
        AND CFP.name != 'lookup_tables'
        AND CFP.name != 'lookup_counter'
    );

-- Insert the default column display typess for each  app_service_support table
INSERT INTO
    meta.appconfig_values (property, value, "table")
SELECT
    CFP.name,
    default_value,
    T.table
FROM
    meta.tables as T,
    meta.appconfig_properties as CFP
WHERE
    schema = ' app_service_support'
    AND CFP.name = 'table_view'
    OR CFP.name = 'visible'
    OR CFP.name = 'metadata_view'
    OR CFP.name = 'details_view'
    OR CFP.name = 'stand_alone_details_view'
    OR CFP.name = 'lookup_tables'
    OR CFP.name = 'lookup_counter';

-- Insert a default script for the scripts table
INSERT INTO
    meta.scripts (name, description, content, table_name)
VALUES
    (
        'default_script',
        'Simple script to print something on the console.',
        'console.log("Hello World");',
        'scripts'
    ),
    (
        'remove_first_object',
        'Removes the first object in a table',
        'try {
    removeRow(1, table_data);
    console.log("Successfully removed a row.");
} catch (e) {
    console.log(e);
}

',
        'scripts'
    ),
    (
        'add_script_object',
        'Add a dummy script object to the scripts table.',
        'try {
    addRow({
        id: 5,
        name: "dummy_script",
        description: "this is just a dummy script",
        content: "console.log(Adding a dummy script);"
    });
} catch (e) {
    console.log(e);
}',
        'scripts'
    ),
    (
        'update_script_object',
        'Updates an existing row.',
        'try {
    updateRow(3, {
        name: "new_script_object"
    })
} catch (e) {
    console.log(e);
}',
        'scripts'
    );

-- Insert the tables names, columns names, schema tables into the i18n_keys table
-- Insert unique column names into i18n_keys
INSERT INTO
    meta.i18n_keys (key_code, is_default)
SELECT DISTINCT
    column,
    true
FROM
    meta.columns;

-- Insert unique table names into i18n_keys
INSERT INTO
    meta.i18n_keys (key_code, is_default)
SELECT DISTINCT
    "table",
    true
FROM
    meta.tables;

-- Insert unique schema names into i18n_keys
INSERT INTO
    meta.i18n_keys (key_code, is_default)
SELECT DISTINCT
    "schema",
    true
FROM
    meta.schemas;

--Settings
INSERT INTO
    meta.i18n_keys (key_code, is_default)
VALUES
    ('settings', true),
    ('general', true),
    ('display', true),
    ('display.tableSpecificConfig', true),
    ('display.displayType', true),
    ('display.displayType.listView', true),
    ('display.displayType.enumView', true),
    ('display.detailsView', true),
    ('display.standAloneDetail', true),
    ('display.lookUpTables', true),
    ('display.columnSpecificConfiguration', true),
    ('display.displayComponentType', true),
    ('scripting.cronJobs', true),
    ('scripting.cronJobs.selectProcedure', true),
    ('scripting.cronJobs.cronScheduleFor', true),
    ('scripting.cronJobs.scheduleJob', true),
    ('scripting.cronJobs.unscheduleJob', true),
    ('scripting.cronJobs.CRONjobScheduleFor', true),
    ('scripting.cronJobs.name', true),
    ('scripting.cronJobs.schedule', true),
    ('scripting.cronJobs.active', true),
    ('scripting.cronJobs.ExecutionLogsFor', true),
    ('scripting.Scripts', true),
    ('scripting.buttonName', true),
    ('scripting.table', true),
    ('scripting.content', true),
    ('Users', true),
    ('emailAddress', true),
    ('firstName', true),
    ('lastName', true),
    ('schemaAccess', true),
    ('addUser', true),
    ('internationalization', true),
    ('addLanguage', true),
    ('refresh', true),
    ('showMissingTrans', true),
    ('selectedLang', true),
    ('label', true),
    ('additionalViews', true),
    ('addViews', true),
    ('targetTable', true),
    ('viewName', true),
    ('viewType', true),
    ('userActionLoggingTracing', true),
    ('welcome', true),
    ('scripting', true),
    ('scripting.EnvVariable', true),
    ('scripting.EnvVariable.NewEnvVariable', true),
    ('scripting.EnvVariable.ExistingEnvVariable', true),
    ('ExecuteProcedures', true),
    ('clickToEdit', true);

-- Insert the default language into the i18n_languages table
INSERT INTO
    meta.i18n_languages (language_code, language_name)
VALUES
    ('en', 'English'),
    ('fr', 'French');

INSERT INTO
    meta.i18n_values (language_id, key_id, value)
VALUES
    (1, 55, 'Settings'),
    (1, 56, 'General'),
    (1, 57, 'Display'),
    (1, 58, 'Table specific configuration'),
    (1, 59, 'Display Type'),
    (1, 60, 'List View'),
    (1, 61, 'Enum View'),
    (1, 62, 'Details View'),
    (1, 63, 'Stand Alone Detail View'),
    (1, 64, 'LookUp Tables'),
    (1, 65, 'Column Specific Configuration'),
    (1, 66, 'Display Component Type'),
    (1, 67, 'Cron Jobs'),
    (1, 68, 'Select Procedure'),
    (1, 69, 'Cron Schedule For'),
    (1, 70, 'SCHEDULE JOB'),
    (1, 71, 'UNSCHEDULE JOB'),
    (1, 72, 'Cron Schedule For'),
    (1, 73, 'Nom'),
    (1, 74, 'Schedule'),
    (1, 75, 'Active'),
    (1, 76, 'Execution Logs for'),
    (1, 77, 'Scripts'),
    (1, 78, 'Button Name'),
    (1, 79, 'Table'),
    (1, 80, 'Content'),
    (1, 81, 'Users'),
    (1, 82, 'Email Address'),
    (1, 83, 'First Name'),
    (1, 84, 'Last Name'),
    (1, 85, 'Schema Access'),
    (1, 86, 'Add User'),
    (1, 87, 'Internationalization'),
    (1, 88, 'Add Language'),
    (1, 89, 'Refresh'),
    (1, 90, 'Show Missing Translations'),
    (1, 91, 'Selected Language'),
    (1, 92, 'Label'),
    (1, 93, 'Additional Views'),
    (1, 94, 'ADD VIEW'),
    (1, 95, 'TargetTable'),
    (1, 96, 'View Name'),
    (1, 97, 'View Type'),
    (1, 98, 'User Action Logging and Tracing'),
    (1, 99, 'welcome'),
    (1, 100, 'Scripting'),
    (1, 101, 'Environment Variable'),
    (1, 102, 'New Environment Variables'),
    (1, 103, 'Existing Environment Variables'),
    (1, 104, 'Execute Procedures'),
    (1, 105, 'Click to edit'),
    (2, 55, 'Configurations'),
    (2, 56, 'General'),
    (2, 57, 'Afficher'),
    (2, 58, 'Configuration spécifique à la table'),
    (2, 59, 'Type d''affichage'),
    (2, 60, 'Vue en liste'),
    (2, 61, 'Vue Énumération'),
    (2, 62, 'Vue détaillée'),
    (2, 63, 'Vue détaillée autonome'),
    (2, 64, 'Tables de recherche'),
    (2, 65, 'Configuration spécifique à la colonne'),
    (2, 66, 'type de composant d''affichage'),
    (2, 67, 'Tâche Cron'),
    (2, 68, 'Sélectionnez la procédure'),
    (2, 69, 'CRON Planifier pour'),
    (2, 70, 'PLANIFIER TÂCHE'),
    (2, 71, 'ANNULER TÂCHE'),
    (2, 72, 'CRON Planifier pour'),
    (2, 73, 'Nom'),
    (2, 74, 'Horaire'),
    (2, 75, 'Actif'),
    (2, 76, 'Journaux d''exécution pour'),
    (2, 77, 'Scripts'),
    (2, 78, 'Nom de boutton'),
    (2, 79, 'Table'),
    (2, 80, 'Contenu'),
    (2, 81, 'Utilisateurs'),
    (2, 82, 'Adresse e-mail'),
    (2, 83, 'Prénom'),
    (2, 84, 'Nom de famille'),
    (2, 85, 'Accès au schéma'),
    (2, 86, 'Ajouter un utilisateur'),
    (2, 87, 'Internationalization'),
    (2, 88, 'Ajouter une langue'),
    (2, 89, 'Rafraîchir'),
    (2, 90, 'Afficher les traductions manquantes'),
    (2, 91, 'Langue sélectionnée'),
    (2, 92, 'Étiquette'),
    (2, 93, 'Vues supplémentaires'),
    (2, 94, 'AJOUTER UNE VUE'),
    (2, 95, 'Tableau cible'),
    (2, 96, 'Nom de la vue'),
    (2, 97, 'Type de visualisation'),
    (
        2,
        98,
        'Journalisation et suivi des actions utilisateur'
    ),
    (2, 99, 'Bienvenue'),
    (2, 100, 'command script'),
    (2, 101, 'Variable d''Environment '),
    (2, 102, 'Nouvelle Variable d''Environment'),
    (2, 103, 'Variable d''Environment Existant'),
    (2, 104, 'Execution de la Procedures'),
    (2, 105, 'Cliquez pour modifier');


NOTIFY pgrst,
'reload schema'