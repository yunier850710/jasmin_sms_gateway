# Jasmin SMPP SMS Gateway Dashboard

A web dashboard for managing Jasmin SMPP SMS Gateway.

## Requirements

- Ubuntu 20.04, 22.04, or 24.04
- Node.js 18.x (installed via script)
- pnpm (installed via script)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yunier850710/jasmin_sms_gateway.git
cd jasmin_sms_gateway
```

2. Make the installation script executable:
```bash
chmod +x install.sh
```

3. Run the installation script:
```bash
./install.sh
```

4. Configure your environment:
- Copy `.env.example` to `.env`
- Edit `.env` with your specific settings:
  - `VITE_API_BASE_URL`: Your API base URL
  - `VITE_JASMIN_API_URL`: Jasmin API URL
  - `VITE_JASMIN_USERNAME`: Jasmin admin username
  - `VITE_JASMIN_PASSWORD`: Jasmin admin password

5. Start the development server:
```bash
pnpm run dev
```

## Updating

To update dependencies and rebuild the project:

1. Make the update script executable:
```bash
chmod +x update.sh
```

2. Run the update script:
```bash
./update.sh
```

## Features

- User Management
  - Authentication
  - User CRUD operations
  - Profile management

- Connector Management
  - SMPP connector creation
  - Status monitoring
  - Start/Stop operations

- Route Management
  - MT/MO route configuration
  - Route ordering
  - Route testing

- Statistics
  - SMPP statistics
  - HTTP statistics
  - System monitoring

## Directory Structure

```
├── src/
│   ├── services/    # API services
│   ├── components/  # React components
│   ├── pages/       # Page components
│   ├── contexts/    # React contexts
│   ├── hooks/       # Custom hooks
│   └── utils/       # Utility functions
├── public/          # Static files
├── .env.example    # Environment template
├── install.sh      # Installation script
└── update.sh       # Update script
```

## License

MIT
