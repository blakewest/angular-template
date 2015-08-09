# Chartbnb
Visualize Airbnb Data

## Contribute

  1. Create a branch
  2. Write a test for the bug or feature
  3. Run ```grunt test``` and watch it fail
  4. Write code
  5. See test pass
  6. Push up branch and pull request

## Environment setup

### Environment setup
You will need...

  * Node Package Manager (can be installed through brew)

    ```brew install npm```

  * grunt for compiling haml, less

    ```npm install -g grunt-cli```

  * bower for fetching static javascript/css assets (like bootstrap)

    ```npm install -g bower```

  * karma and phantomjs for running angular tests

    ```npm install -g karma phantomjs```

### Running the server locally

  1. Checkout the repo

    ```git clone``` {{use the git clone link at the right}}
  2. Enter project directory, see that RVM does not error

    ```cd chartbnb```
  3. Install node packages locally

    ```npm install```
  4. Install your bower packages and copy them into /public

    ```grunt install```
  5. Run your static server w/ proxy!

    ```npm start```
    
    - If you get `[Proxy] Error!!!` you are not running the API server, but everything else is working correctly.

