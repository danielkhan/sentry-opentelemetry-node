module.exports = {
  apps: [
    {
      name: "Express Service BLUE",
      script: "npm start",
    },
  ],
  deploy: {
    // "production" is the environment name
    production: {
      // SSH key path, default to $HOME/.ssh
      key: "/Users/daniel.khan/CodeKitchen/credentials/dkhan-ec2-dynatrace.pem",
      // SSH user
      user: "deploy",
      // SSH host
      host: ["otel-jaeger.research.dev.dynatracelabs.com"],
      // SSH options with no command-line flag, see 'man ssh'
      // can be either a single string or an array of strings
      ssh_options: "StrictHostKeyChecking=no",
      // GIT remote/branch
      ref: "origin/master",
      // GIT remote
      repo: "https://github.com/danielkhan/voting-service-blue.git",
      // path in the server
      path: "/home/deploy/apps/voting-service-blue",
      // Pre-setup command or path to a script on your local machine
      // pre-setup: "apt-get install git ; ls -la",
      // Post-setup commands or path to a script on the host machine^
      // eg: placing configurations in the shared dir etc
      // post-setup: "ls -la",
      // pre-deploy action
      // pre-deploy-local: "echo 'This is a local executed command'",
      // post-deploy action
      "post-deploy": "npm install",
    },
  },
};
