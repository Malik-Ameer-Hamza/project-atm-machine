#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import { Spinner, createSpinner } from "nanospinner";
import showBanner from "node-banner";

// Function to create a delay
let sleep = (time: number = 2000) => new Promise((r) => setTimeout(r, time));


// Global variables for default user credentials and account balance
let ID = 1234;
let Pin = 4321;
let totalAmount = 10000;


// Displays banner with a message
async function displayBanner() {
    await showBanner(
        "ATM Machine",
        "You can perform similar functions like an atm machine in this program."
    );
}


// Prompting for user account type
async function accountType(): Promise<{account:string}>{
    let {account} = await inquirer.prompt([{
        name: "account",
        type : "list",
        choices : ["Current Account","Saving Account"],
        message : "Choose your account: "
    }]);

    return {account};
};


// Authenticates the user with ID and PIN
async function login(): Promise<{ userID: number, userPin: number }> {
    let { userID, userPin } = await inquirer.prompt([{
        name: "userID",
        type: "number",
        default: 1234,
        message: chalk.magenta("Enter your ID:")
    },
    {
        name: "userPin",
        type: "number",
        default: 4321,
        message: chalk.magenta("Enter your Pin:")
    }]);

    let spinner: Spinner = createSpinner(chalk.rgb(79, 206, 93)("Authenticating")).start();
    await sleep();

    if (userID === ID && userPin === Pin) {
        spinner.success({ text: chalk.greenBright(` Authentication Successfull`) })
    } else {
        spinner.error({ text: chalk.redBright(` Authentication Failed`) });
        await login();
    }

    return { userID, userPin }
}


// Prompts the user to select a transaction option
async function selectOptions(): Promise<{ options: string }> {
    let { options } = await inquirer.prompt([{
        name: "options",
        type: "list",
        choices: ["Cash RS. 500", "Cash RS. 1000", "Cash RS. 2000", "Other Amounts", "Cash Deposit", "Balance Inquiery"],
        message: chalk.magenta("Please select a transaction: ")
    }]);



    return { options };
}


// Prompts the user to select a custom withdrawal amount
async function otherAmounts(): Promise<string> {
    let { otherAmount } = await inquirer.prompt([{
        name: "otherAmount",
        type: "list",
        pageSize: 8,
        choices: ["Rs. 2500", "Rs. 3000", "Rs. 5000", "Rs. 7000", "Rs. 10000", "Rs. 15000", "Rs. 20000", "Other Amounts"],
        message: chalk.magenta("Please select withdrawl amount: ")
    }]);

    return otherAmount;
};


// Prompts the user to enter a custom amount for withdrawal or deposit
async function Amount(): Promise<number> {
    let { amount } = await inquirer.prompt([{
        name: "amount",
        type: "number",
        validate: (input) => {
            if (isNaN(input)) {
                console.log(chalk.redBright("Please enter a number."))
            } else {
                return true;
            }
        },
        message: chalk.magentaBright("Please enter amount: ")

    }]);

    return amount;
}


// Processes a custom cash withdrawal
async function customCashWithdraw(): Promise<void> {
    let cashWithdrawn = await Amount();
    let spinner: Spinner = createSpinner(chalk.rgb(79, 206, 93)(`\t Please Wait... \n  your transaction is in process`)).start();
    await sleep();
    if (cashWithdrawn <= totalAmount) {
        spinner.success({ text: chalk.green(` RS. ${cashWithdrawn} withdrawl succesfully.`) });
        totalAmount -= cashWithdrawn;
    } else {
        spinner.error({ text: chalk.red(` Your current balance is less than ${chalk.green(`RS. ${cashWithdrawn}`)}`) })
    }


}


// Processes a fixed cash withdrawal based on the chosen option
async function fixedCashWithdraw(cash: string): Promise<void> {
    let amount = 0;

    if (cash === "Cash RS. 500") {
        amount = 500;
    } else if (cash === "Cash RS. 1000") {
        amount = 1000;
    } else if (cash === "Cash RS. 2000") {
        amount = 2000;
    } else if (cash === "Rs. 2500") {
        amount = 2500;
    } else if (cash === "Rs. 3000") {
        amount = 3000;
    } else if (cash === "Rs. 5000") {
        amount = 5000;
    } else if (cash === "Rs. 7000") {
        amount = 7000;
    } else if (cash === "Rs. 10000") {
        amount = 10000;
    } else if (cash === "Rs. 15000") {
        amount = 15000;
    } else if (cash === "Rs. 20000") {
        amount = 20000;
    };


    let spinner: Spinner = createSpinner(chalk.rgb(79, 206, 93)(`\t Please Wait... \n  your transaction is in process`)).start();
    await sleep();

    if (amount <= totalAmount) {
        spinner.success({ text: chalk.green(` RS. ${amount} withdrawl succesfully.`) });
        totalAmount -= amount;
    } else {
        spinner.error({ text: chalk.red(` Your current balance is less than ${chalk.green(`RS. ${amount}`)}`) })
    }

};


// Processes a cash deposit
async function cashDeposit(): Promise<void> {
    let cashDeposited = await Amount();
    let spinner: Spinner = createSpinner(chalk.rgb(79, 206, 93)(" Processing, Please Wait!")).start();
    await sleep();
    spinner.success({ text: chalk.green(` RS. ${cashDeposited} deposit successfully.`) });
    totalAmount += cashDeposited;


}


// Displays the current account balance
async function currentBalance(): Promise<void> {
    console.log(`Your current amount is RS. ${totalAmount}`);
}


// Prompts the user to confirm exit
async function Exit(): Promise<boolean> {
    let { again } = await inquirer.prompt([{
        name: "again",
        type: "confirm",
        message: "Do you want to exit? ",
    }]);

    return again;
}


// Main function that handle all ATM functionality
async function atmFunctions() {
    await displayBanner();
    await sleep(1000);

    let { userID, userPin } = await login();
    let again = false;
    let {account} = await accountType();
    account === "Current Account" ? again : account === "Saving Account" ? again : "Error";
    
    while (!again) {
        
        let { options } = await selectOptions();

        if (["Cash RS. 500", "Cash RS. 1000", "Cash RS. 2000"].includes(options)) {
            await fixedCashWithdraw(options);
        } else if (options === "Balance Inquiery") {
            await currentBalance();
        } else if (options === "Cash Deposit") {
            await cashDeposit();
        } else if (options === "Other Amounts") {
            let chosenAmount = await otherAmounts();
            if (["Rs. 2500", "Rs. 3000", "Rs. 5000", "Rs. 7000", "Rs. 10000", "Rs. 15000", "Rs. 20000"].includes(chosenAmount)) {
                await fixedCashWithdraw(chosenAmount);
            } else if (chosenAmount === "Other Amounts") {
                await customCashWithdraw();
            }

        }

        again = await Exit();

        if (again) {
            console.log(chalk.rgb(79, 206, 93)(`Thank you for using our ATM service. `))
        }
    }


};


atmFunctions();
