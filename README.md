# Project Name

>CrowdCart

## Team

  - __Product Owner__: Ryan Busby
  - __Scrum Master__: Hoon Bae
  - __Development Team Members__: Tyler Predale,, Yasser Mahmud, John Smally

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

- Signup/create account (most of site is blocked behind auth)
- mylist - used to view created lists and user link to create new lists
- listdetail - click on active list to see details - need to expand headers for more detail info - this link is not gated and can be shared (notice URL passes through listid)
- alllists - show all list EXCEPT (1) your own lists, (2) lists claimed by other users as "jobs", (3) and expired lists
- myjobs - view lists you have claimed as jobs to fulfill


## Requirements

client (majority are piped in via cdn links on index.html)
- "angular": "^1.5.8"
- "angular-ui-bootstrap": "^2.1.3",
- "moment.js":  "^2.9.0",
- "angular-moment": "^1.0.0-beta.6",
- "angular-route": "^1.5.8",
- Google maps API + key

server
- "node.js": "6.2.2"
- "bcrypt-nodejs": "0.0.3",
- "body-parser": "^1.4.3",
- "express": "^4.4.5",
- "jwt-simple": "^0.2.0",
- "mongoose": "^4.1.0",
- current deployed on heroku

## Development


### Installing Dependencies

From within the root directory:

```sh
npm install
```

### Tasks
 - Add project planning docs


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
