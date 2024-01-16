# MSGraphDashBoard

Currently hosted at: https://ms-dashboard-ccecc603061b.herokuapp.com/

# To start

1. npm install to download dependencies, this will auto install server and client packages
2. You'll need .env file with secrets, use env-example as sample, rename to .env, and use Heroku config var and copy values for local development, reach out to me for those.
3. npm start would start local dev mode, watching only FE at this point, you can run watch-be if needed
4. npm run prod would start prod mode, with build version of client, need to run npm build to serve that
5. to build client use npm build
6. You can sign up for new account, or just use test/test

Note: if you get `Invalid options object. Dev Server has been initialized using an options object that does not match the API schema` when running the client locally  
adjust .env-copy to .env for client
Ref: https://stackoverflow.com/questions/70374005/invalid-options-object-dev-server-has-been-initialized-using-an-options-object
