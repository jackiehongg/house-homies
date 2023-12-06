# HouseHomies
HouseHomies is a tool for users to split a bill amongst each other in a group. The webapp will replace a Google Sheets maintained by myself that is currently serving the aforementioned purpose. This implementation improves upon the Google Sheets version by providing more flexibility with the layout such adding/removing members, adding/removing bill items, avoiding formatting issues as well as offering a welcoming appearance. By using Househomies, users can maintain their own bills with their own groups without assistance.
Hosted at https://house-homies.onrender.com. 

## Features and Roadmap
- [x] Add group members and billable items
- [x] Claim billable items for involved members
- [x] Calculate amounts owed by each member for their claimed items
    - [x] Weighted claims for uneven shares
    - [x] Consider multiple purchasers
- [x] Remove members or billable items
- [x] Basic accounts
    - [x] Save and load past bills
    - [ ] Spending dashboard
- [ ] Sorting
- [ ] Considerations for accessibility
- [ ] Mobile improvements
- [x] Share link

## Technologies
* React
* Flask
* MongoDB