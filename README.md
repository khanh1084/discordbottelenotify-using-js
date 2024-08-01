# Discord-Telegram Bot

A bot that forwards messages from Discord to Telegram.

## Table of Contents

-   [Installation](#installation)
-   [Configuration](#configuration)
-   [Usage](#usage)
-   [License](#license)

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/khanh1084/discordbottelenotify-using-js.git
    cd discordbottelenotify-using-js
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

## Configuration

1. Create a `.env` file in the root directory of the project. You can use the `.env.example` file as a template:

    ```sh
    cp .env.example .env
    ```

2. Fill in the required environment variables in the `.env` file:

    ```env
        DISCORD_TOKEN=your_discord_token_here
        TELEGRAM_TOKEN=your_telegram_token_here
        TELEGRAM_CHAT_ID=your_telegram_chat_id_here
        GOOGLE_SHEET_ID=your_google_sheet_id_here
        GOOGLE_SERVICE_ACCOUNT_FILE=path/to/your/service-account-file.json
    ```

## Usage

To start the bot, run the following command:

    ```sh
    npm start
    ```

This will start the bot and it will begin forwarding messages from the specified Discord channels to the specified Telegram chat.

## License

    This project is licensed under the ISC License.
