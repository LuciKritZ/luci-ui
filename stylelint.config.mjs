/** @type {import('stylelint').Config} */
const config = {
  extends: ["stylelint-config-standard-scss"],
  ignoreFiles: ["**/node_modules/**", ".next/**"],
  rules: {
    "at-rule-empty-line-before": null,
    "custom-property-empty-line-before": null,
    "no-invalid-position-declaration": null,
    "scss/at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "theme",
          "plugin",
          "utility",
          "custom-variant",
          "apply",
          "layer",
          "screen",
        ],
      },
    ],
    "selector-class-pattern": null,
  },
};

export default config;
