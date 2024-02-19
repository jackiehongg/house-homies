# HouseHomies
HouseHomies is a tool for a group of users to split a bill amongst each other in a group. The webapp replaces a Google Sheets maintained by myself that is currently serving the aforementioned purpose. This implementation streamlines the Google Sheets version by providing more flexibility with the layout such as adding/removing members, adding/removing bill items, avoiding formatting issues as well as offering a welcoming appearance. By using Househomies, new users can create and manage bills within their own groups without assistance.  
<br>Hosted at https://house-homies.onrender.com. 

## Features and Roadmap
- [x] Add/remove group members and items
- [x] Each Member can claim items
- [x] Calculate amounts owed by each member for their claimed items
    - [x] Weighted claims for uneven shares
    - [x] Support for multiple purchasers under one receipt
- [x] Google Accounts
    - [x] Save and load past receipts
- [x] Share link
- [x] Autosaving and synchronous editing
- [ ] Sorting


## Technologies
* React
* Flask
* MongoDB