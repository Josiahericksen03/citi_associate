import os
from abc import ABC, abstractmethod
from decimal import Decimal

DIV = "----------------------------------------"


def clear_screen():
    os.system("cls" if os.name == "nt" else "clear")


# step 1: transaction interface
class ITransaction(ABC):
    @abstractmethod
    def print_receipt(self):
        pass


# basic user for login
class User:
    def __init__(self, username, password):
        self.username = username
        self.password = password


# step 2: customer
class Customer(User):
    def __init__(self, customer_id, first_name, last_name, username, password):
        super().__init__(username, password)
        self._customer_id = customer_id
        self._first_name = first_name
        self._last_name = last_name
        self._accounts = []

    @property
    def customer_id(self):
        return self._customer_id

    @customer_id.setter
    def customer_id(self, value):
        self._customer_id = value

    @property
    def first_name(self):
        return self._first_name

    @first_name.setter
    def first_name(self, value):
        self._first_name = value

    @property
    def last_name(self):
        return self._last_name

    @last_name.setter
    def last_name(self, value):
        self._last_name = value

    @property
    def accounts(self):
        return self._accounts

    @accounts.setter
    def accounts(self, value):
        self._accounts = value


# step 3: account base class
class Account(ITransaction, ABC):
    def __init__(self, account_number, account_holder, balance=0):
        self._account_number = account_number
        self._account_holder = account_holder
        if isinstance(balance, Decimal):
            self._balance = balance
        else:
            self._balance = Decimal(str(balance))

    @property
    def account_number(self):
        return self._account_number

    @account_number.setter
    def account_number(self, value):
        self._account_number = value

    @property
    def account_holder(self):
        return self._account_holder

    @account_holder.setter
    def account_holder(self, value):
        self._account_holder = value

    @property
    def balance(self):
        return self._balance

    @balance.setter
    def balance(self, value):
        if isinstance(value, Decimal):
            self._balance = value
        else:
            self._balance = Decimal(str(value))

    def deposit(self, amount):
        amount = Decimal(str(amount))
        if amount <= 0:
            print("deposit has to be more than 0")
            return
        self._balance = self._balance + amount

    @abstractmethod
    def withdraw(self, amount):
        pass


# step 4: savings
class SavingsAccount(Account):
    def __init__(self, account_number, account_holder, balance=0, interest_rate=0.03):
        super().__init__(account_number, account_holder, balance)
        self._interest_rate = Decimal(str(interest_rate))

    @property
    def interest_rate(self):
        return self._interest_rate

    @interest_rate.setter
    def interest_rate(self, value):
        self._interest_rate = Decimal(str(value))

    def withdraw(self, amount):
        amount = Decimal(str(amount))
        min_balance = Decimal("100")
        if self._balance - amount < min_balance:
            print("Savings: can't go below $100")
            return
        self._balance = self._balance - amount

    def print_receipt(self):
        print(
            f"\n  Savings receipt\n"
            f"  Account: {self._account_number}\n"
            f"  Balance: {self._balance}\n"
            f"  Interest rate: {self._interest_rate}\n"
        )

########################################################################################
# step 5: checking
class CheckingAccount(Account):
    def __init__(self, account_number, account_holder, balance=0, overdraft_limit=500):
        super().__init__(account_number, account_holder, balance)
        self._overdraft_limit = Decimal(str(overdraft_limit))

    @property
    def overdraft_limit(self):
        return self._overdraft_limit

    @overdraft_limit.setter
    def overdraft_limit(self, value):
        self._overdraft_limit = Decimal(str(value))

    def withdraw(self, amount):
        amount = Decimal(str(amount))
        lowest = self._overdraft_limit * -1
        if self._balance - amount < lowest:
            print("Checking: over overdraft limit")
            return
        self._balance = self._balance - amount

    def print_receipt(self):
        print(
            f"\n  Checking receipt\n"
            f"  Account: {self._account_number}\n"
            f"  Balance: {self._balance}\n"
            f"  Overdraft limit: {self._overdraft_limit}\n"
        )

########################################################################################
# step 6: customer database (seeded on startup)
customers = []
customer_counter = 1


def seed_customers():
    # default customers + accounts so we can test login/withdraw right away
    global customers, customer_counter

    customers.clear()

    josiah = Customer(1, "Josiah", "", "josiah", "1234")
    josiah.accounts.append(SavingsAccount("Josiah Savings", josiah, 500))
    josiah.accounts.append(CheckingAccount("Josiah Checking", josiah, 200, 300))
    customers.append(josiah)

    alex = Customer(2, "Alex", "Smith", "alex", "1234")
    alex.accounts.append(CheckingAccount("Alex Checking", alex, 150, 250))
    customers.append(alex)

    sam = Customer(3, "Sam", "Lee", "sam", "sam123")
    sam.accounts.append(SavingsAccount("Sam Savings", sam, 1000))
    customers.append(sam)

    customer_counter = 4  # next id if admin adds someone


def find_customer(username):
    for c in customers:
        if c.username == username:
            return c
    return None


def find_customer_by_id(customer_id):
    for c in customers:
        if c.customer_id == customer_id:
            return c
    return None


def welcome():
    print(f"\n  Welcome to ABC Digital Bank\n{DIV}\n")


def login():
    print(f"  LOGIN\n{DIV}\n  Enter username and password (space between them)\n")
    line = input("  > ").strip()
    parts = line.split()

    if len(parts) < 2:
        return "failed"

    username = parts[0]
    password = parts[1]

    if username == "admin" and password == "admin":
        return "admin"

    for c in customers:
        if c.username == username and c.password == password:
            return username

    return "failed"


def pick_customer():
    if not customers:
        print("\n  No customers in the system\n")
        return None

    lines = ["\n  Customers:", DIV]
    for c in customers:
        lines.append(
            f"  {c.customer_id} - {c.first_name} {c.last_name} ({len(c.accounts)} account(s))"
        )
    lines.append("")
    print("\n".join(lines))

    pick = input("  Customer ID: ").strip()
    try:
        return find_customer_by_id(int(pick))
    except ValueError:
        print("\n  enter a valid customer ID\n")
        return None


def pick_account(customer):
    if len(customer.accounts) == 0:
        print("\n  No accounts yet\n")
        return None

    lines = ["\n  Your accounts:", DIV]
    for i, acct in enumerate(customer.accounts):
        lines.append(
            f"  {i + 1} - {type(acct).__name__} {acct.account_number} | balance: {acct.balance}"
        )
    lines.append("")
    print("\n".join(lines))

    pick = input("  Pick account number: ").strip()
    try:
        idx = int(pick) - 1
        if idx < 0 or idx >= len(customer.accounts):
            print("\n  bad choice\n")
            return None
        return customer.accounts[idx]
    except ValueError:
        print("\n  enter a number\n")
        return None


# step 7: menu (shown only after login)
def show_main_menu(is_admin, logged_in_customer=None):
    if is_admin:
        who = "admin"
    else:
        who = logged_in_customer.username
    print(
        f"\n  ABC Digital Bank\n"
        f"{DIV}\n"
        f"  Logged in as: {who}\n"
        f"{DIV}\n"
        f"  1. Create Account\n"
        f"  2. View All Accounts\n"
        f"  3. Deposit\n"
        f"  4. Withdraw\n"
        f"  5. Transfer\n"
        f"  6. Close Account\n"
        f"  7. Exit\n"
    )


def resolve_customer(is_admin, logged_in_customer):
    if logged_in_customer is not None:
        return logged_in_customer
    if is_admin:
        return pick_customer()
    return None


def create_account(is_admin=False, logged_in_customer=None):
    customer = resolve_customer(is_admin, logged_in_customer)
    if customer is None:
        return

    print(f"\n  Account type\n{DIV}\n  1. Savings\n  2. Checking\n")
    acct_type = input("  Choice: ").strip()
    acct_number = input("  Account number: ").strip()
    balance = input("  Opening balance: ").strip()

    if acct_type == "1":
        rate = input("  Interest rate (e.g. 0.03): ").strip() or "0.03"
        customer.accounts.append(
            SavingsAccount(acct_number, customer, balance, rate)
        )
        print(f"\n  Savings account {acct_number} created\n")
    elif acct_type == "2":
        limit = input("  Overdraft limit (e.g. 500): ").strip() or "500"
        customer.accounts.append(
            CheckingAccount(acct_number, customer, balance, limit)
        )
        print(f"\n  Checking account {acct_number} created\n")
    else:
        print("\n  pick 1 or 2\n")


def view_all_accounts(logged_in_customer=None):
    if logged_in_customer is not None:
        customer_list = [logged_in_customer]
        title = "\n  Your accounts:"
    else:
        if not customers:
            print("\n  No customers in the system\n")
            return
        customer_list = customers
        title = "\n  All accounts:"

    lines = [title, DIV]
    for c in customer_list:
        if not c.accounts:
            lines.append(f"  {c.first_name} {c.last_name} (ID {c.customer_id}) - no accounts")
            continue
        for acct in c.accounts:
            lines.append(
                f"  {c.first_name} {c.last_name} | {type(acct).__name__} | "
                f"{acct.account_number} | balance: {acct.balance}"
            )
    lines.append("")
    print("\n".join(lines))


def deposit(is_admin=False, logged_in_customer=None):
    customer = resolve_customer(is_admin, logged_in_customer)
    if customer is None:
        return
    acct = pick_account(customer)
    if acct is None:
        return
    amt = input("\n  Deposit amount: ").strip()
    try:
        acct.deposit(amt)
        print(f"\n  New balance: {acct.balance}\n")
        acct.print_receipt()
    except Exception as e:
        print(f"\n  Deposit failed: {e}\n")


def withdraw(is_admin=False, logged_in_customer=None):
    customer = resolve_customer(is_admin, logged_in_customer)
    if customer is None:
        return
    acct = pick_account(customer)
    if acct is None:
        return
    amt = input("\n  Withdraw amount: ").strip()
    try:
        acct.withdraw(amt)
        print(f"\n  New balance: {acct.balance}\n")
        acct.print_receipt()
    except Exception as e:
        print(f"\n  Withdraw failed: {e}\n")


def transfer(is_admin=False, logged_in_customer=None):
    print(f"\n  Transfer — from account\n{DIV}")
    from_customer = resolve_customer(is_admin, logged_in_customer)
    if from_customer is None:
        return
    from_acct = pick_account(from_customer)
    if from_acct is None:
        return

    print(f"\n  Transfer — to account\n{DIV}")
    to_customer = pick_customer()
    if to_customer is None:
        return
    to_acct = pick_account(to_customer)
    if to_acct is None:
        return

    if from_acct is to_acct:
        print("\n  Cannot transfer to the same account\n")
        return

    amt = input("\n  Transfer amount: ").strip()
    try:
        amount = Decimal(str(amt))
        if amount <= 0:
            print("\n  Amount must be greater than 0\n")
            return
        balance_before = from_acct.balance
        from_acct.withdraw(amount)
        if from_acct.balance == balance_before:
            print("\n  Transfer cancelled (withdrawal rules blocked it)\n")
            return
        to_acct.deposit(amount)
        print(
            f"\n  Transferred {amount} from {from_acct.account_number} "
            f"to {to_acct.account_number}\n"
        )
    except Exception as e:
        print(f"\n  Transfer failed: {e}\n")


def close_account(is_admin=False, logged_in_customer=None):
    customer = resolve_customer(is_admin, logged_in_customer)
    if customer is None:
        return
    acct = pick_account(customer)
    if acct is None:
        return
    confirm = input(f"\n  Close {acct.account_number}? (y/n): ").strip().lower()
    if confirm == "y":
        customer.accounts.remove(acct)
        print(f"\n  Account {acct.account_number} closed\n")
    else:
        print("\n  Cancelled\n")


def run_bank_menu(is_admin, logged_in_customer=None):
    while True:
        clear_screen()
        show_main_menu(is_admin, logged_in_customer)
        choice = input("  Choice: ").strip()

        if choice == "1":
            create_account(is_admin, logged_in_customer)
        elif choice == "2":
            view_all_accounts(logged_in_customer)
        elif choice == "3":
            deposit(is_admin, logged_in_customer)
        elif choice == "4":
            withdraw(is_admin, logged_in_customer)
        elif choice == "5":
            transfer(is_admin, logged_in_customer)
        elif choice == "6":
            close_account(is_admin, logged_in_customer)
        elif choice == "7":
            name = "admin" if is_admin else logged_in_customer.first_name
            print(f"\n  Goodbye, {name}\n{DIV}\n")
            break
        else:
            print("\n  Please enter a number from 1 to 7\n")

        input("\n  Press Enter to continue...")


def main():
    seed_customers()
    welcome()

    login_result = login()
    while login_result == "failed":
        print(f"\n  Validation failed. Try again.\n{DIV}\n")
        login_result = login()

    is_admin = login_result == "admin"
    logged_in_customer = None
    if not is_admin:
        logged_in_customer = find_customer(login_result)
        if logged_in_customer is None:
            print("\n  something went wrong finding customer\n")
            return

    run_bank_menu(is_admin, logged_in_customer)


if __name__ == "__main__":
    main()
