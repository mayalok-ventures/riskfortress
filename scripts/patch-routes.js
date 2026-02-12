const fs = require('fs')
const path = require('path')

const routesPath = path.join(__dirname, '..', 'out', '_routes.json')

if (fs.existsSync(routesPath)) {
    const routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'))
    let changed = false

    if (!routes.include.includes('/s/*')) {
        routes.include.push('/s/*')
        changed = true
    }

    if (changed) {
        fs.writeFileSync(routesPath, JSON.stringify(routes, null, 2))
        console.log('Patched _routes.json:', JSON.stringify(routes.include))
    }
} else {
    console.log('No _routes.json found, skipping patch')
}
