// main.js

import * as tsj from "ts-json-schema-generator";
import * as fs from "fs";

/** @type {import('ts-json-schema-generator/dist/src/Config').Config} */
const configs = [
    {
        path: "./src/util/formBuilder/types.ts",
        tsconfig: "./tsconfig.json",
        type: "Renderable", // Or <type-name> if you want to generate schema for that one type only,
        output: "../schema/renderer.schema.json",
    },
];

for (let config of configs) {
    //console.log(`Generating schema for ${config.path} :: ${config.type}`);
    const schema = tsj.createGenerator(config).createSchema(config.type);
    const schemaString = JSON.stringify(schema, null, 2);
    fs.writeFile(config.output, schemaString, (err) => {
        if (err) throw err;
    });
    //console.log(`Wrote schema to ${config.output}`);
}
