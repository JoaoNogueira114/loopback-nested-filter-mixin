# loopback-nested-filter-mixin

## Features

- workaround to provide a functionality equivalent to nested queries
- remove all or only some of the entries that do not respect the criteria

## Description
This mixin is a workaround to an issue with loopback that does not allow to queries to filter based on nested properties. This is not a patch the connectors.

## Installation

```bash
npm install loopback-nested-filter-mixin --save
```

## How to use

Add the mixin property to your server/model-config.json like the following:

```json
{
  "_meta": {
    "sources": [
      "loopback/common/models",
      "loopback/server/models",
      "../common/models",
      "./models"
    ],
    "mixins": [
      "loopback/common/mixins",
      "loopback/server/mixins",
      "../common/mixins",
      "./mixins",
      "../node_modules/loopback-nested-filter-mixin"
    ],
  }
}

```

Add the mixin attribute to the definition of all Models you want to use it with.

```json
{
  "name": "app",
  "properties": {
    "name": {
      "type": "string",
    }
  },
  "relations": {
    "users": {
      "type": "hasMany",
      "model": "user",
      "foreignKey": "appId",
      "through": "userRole"
    }
  },
  "mixins": {
    "NestedSearch": null
  }
}
```

## Usage
When filtering on nested objects, the user should specify his conditions in the include filter, according to the following example (using the [Appointment example from docs](https://loopback.io/doc/en/lb3/HasManyThrough-relations.html)).
In this case, we want to get the information of any patient that has an appointment with any Doctor named Strange.
```
GET /patients?filter={"include":[{
  "relation": "appointment",
  "scope": {
    "include": [{
      "relation": "physician",
      "scope": {
        "where": {"name": "Strange"}
      }
    }]
  }
  }]
}
```


The mixin is configured to support two different filtering behaviours:

1) Remove any entry it finds where the includes generated an empty list. 

(Loopback's default behaviour would be to return every patient.appointment either with Strange's info or an empty list)

```json
{
  "where": "...",
  "include": "...",
  "excludeIfEmpty": true
}
```

2) Remove any entry it finds where the includes generated an empty list and the user set it as an exclusion criteria. 

```json
{
  "where": "...",
  "include": [{
    "relation": "appointment",
    "scope": {
      "include": [{
        "relation": "physician",
        "scope": {
          "where": {"name": "Strange"},
          "include": [{
            "relation": "university",
            "scope": {
              "where": {"name": "Harvard"}
            }
          }]
        }
      }]
    }
    }],
  },
  "excludeIfEmpty": ["appointment.physician"]
}
```
In this case, we want to get the info of every Patient that has an Appointment with a Doctor named Strange and, in case he went to Harvard, we want to retrieve that information. But we don't want it to be an exclusion criteria.

## License

[MIT](LICENSE)
