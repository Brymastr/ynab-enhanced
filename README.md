# wealth-for-ynab

#### AWS SSM

These parameters must be created in AWS SSM Parameter Store

| Parameter                 | Value                                          |
| ------------------------- | ---------------------------------------------- |
| `/YNAB/ApiUrl`            | `https://api.youneedabudget.com/v1`            |
| `/YNAB/AuthUrl`           | `https://auth.youneedabudget.com/v1`           |
| `/YNAB/ClientId`          | 1Password                                      |
| `/YNAB/ClientSecret`      | 1Password                                      |
| `/YNAB/AuthRedirectUri`   | `{Api}/auth/token`                             |
| `/YNAB/ClientRedirectUri` | `{Api}/auth/login`                             |
| `/Questrade/ApiUrl`       | `https://api01.iq.questrade.com`               |
| `/Questrade/AuthUrl`      | `https://login.questrade.com/oauth2/authorize` |
| `/Questrade/ClientId`     | 1Password                                      |
| `/Questrade/ClientSecret` | 1Password                                      |
