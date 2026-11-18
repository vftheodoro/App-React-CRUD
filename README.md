# Car App — React Native CRUD

Academic mobile project demonstrating create, read, update, and delete operations for a car catalog. The mobile interface is implemented with React Native / Expo and communicates with a PHP API backed by SQL.

## Demonstrated functionality

- Browse car records and open details.
- Create and edit entries through forms.
- Organize favorite cars and view a user profile.
- Navigate between screens using React Navigation.
- Store or access data through the project's API and local app storage, according to each feature.

## Architecture

| Component | Location | Technologies |
| --- | --- | --- |
| Mobile client | `App.js`, `src/screens`, `src/components` | React Native, Expo |
| Backend | `api/cars.php`, `api/config.php` | PHP |
| Database seed/schema | `Banco de Dados/cars.sql` | SQL |
| API configuration | `src/config.js` | JavaScript |
| UI guidance | `DESIGN_SYSTEM.md`, `DESIGN_ACCESSIBILITY.md` | Documentation |

## Run locally

**Requirements:** Node.js/npm, a PHP-compatible web server, and a database configured for the accompanying PHP API.

1. Clone: `git clone https://github.com/vftheodoro/App-React-CRUD.git`.
2. Import `Banco de Dados/cars.sql` into a compatible database and configure `api/config.php` for your local environment.
3. Serve the `api` directory with a local PHP environment.
4. Replace the development-network API address in `src/config.js` with a URL reachable from your emulator/physical device.
5. Install dependencies and start Expo:

```bash
npm ci
npm start
```

You can also use `npm run android`, `npm run ios`, or `npm run web` for supported Expo targets. The API and device must be able to communicate over the network.

## Screenshots

- [Home](Imagens/Tela%20inicial.png)
- [Car details](Imagens/Tela%20de%20Detalhes%20dos%20Carros.png)
- [Add car](Imagens/Tela%20de%20Adicionar%20Carro.png)
- [Edit car](Imagens/Tela%20de%20Editar%20Carro.png)
- [Favorites](Imagens/Tela%20de%20Carros%20Favoritos.png)
- [Profile](Imagens/Tela%20de%20Perfil%20do%20Usuario.png)

## Scope and security

This is a learning project, not a production-ready vehicle management service. Replace hard-coded network addresses, review PHP database credentials and authentication requirements, and validate input before any public deployment.

## License

See [LICENSE](LICENSE).
