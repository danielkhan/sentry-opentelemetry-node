module.exports = {
  apps : [{
    name   : "frontend",
    script : "frontend/bin/www"
  },
  {
    name   : "service-gateway",
    script : "service-gateway/bin/www"
  },{
    name   : "service-green",
    script : "service-green/bin/www"
  },{
    name   : "service-blue",
    script : "service-blue/bin/www"
  }]
}
