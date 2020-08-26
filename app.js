const app = new Vue({
    el: "#app",
    data: {
        devURL: "http://localhost:3000",
        prodURL: "https://trelloappclone.herokuapp.com",
        loggedin: false,
        createUsername: "",
        createPassword: "",
        loginUsername: "",
        loginPassword: "",
        user: null,
        token: null,
        boardSingle: false,
        boards: [],
        newBoard: "",
        boardName:"",
        boardID: 0,
        // listResponse: false,
        allLists: [],
        listInput: "",
        listID: 0,
        allItems: [],
        input:{},
        itemID: 0,
        updatingItem: "",
        "list.id": 0
    },
    
    methods: {
        handleLogin: function(e){
            // e.preventDefault()
            const URL = this.prodURL ? this.prodURL : this.devURL
            // console.log(URL)
            const user = { 
                username: this.loginUsername, 
                password: this.loginPassword
            }
            // console.log(user)
            fetch(`${URL}/login`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.error){
                    alert("Error Logging in")
                } else {
                    this.user = data.user
                    console.log(this.user)
                    this.token = data.token
                    this.loggedin = true
                    this.getBoards()
                    // Clears out input fields:
                    this.loginUsername = ""
                    this.loginPassword = ""
                }
            })
        },
        handleLogout: function(e){
            this.loggedin = false
            this.user = null
            this.token = null
        },
        handleSignup: function(e){
            const URL = this.prodURL ? this.prodURL : this.devURL
            const user = { 
                username: this.createUsername, 
                password: this.createPassword
            }
            fetch(`${URL}/users`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.error){
                    alert("Sign up unsuccessful")
                } else {
                    this.user = data.user
                    console.log(this.user)
                    this.token = data.token
                    this.loggedin = true
                    // Clears out input fields:
                    this.createUsername = ""
                    this.createPassword = ""
                }
            })
        },
        getBoards: function(e){
            const URL = this.prodURL ? this.prodURL : this.devURL
            fetch(`${URL}/boards`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `bearer ${this.token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.boards = data
            })
        },
        showBoard: function(e){
            const URL = this.prodURL ? this.prodURL : this.devURL
            this.boardID = e.target.id
            console.log(this.boardID, e.target.id)
            fetch(`${URL}/boards/${e.target.id}`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `bearer ${this.token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.boardSingle = true
                this.boards = data.board_name
                console.log(this.boards)
            })
            .then(() => {
                this.showList()
                this.showItems()
            })
        },
       
        createBoard: function(e){
            const URL = this.prodURL ? this.prodURL : this.devURL
            const newBoard = {board_name: this.boardName}
            fetch(`${URL}/users/${this.user.id}/boards`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `bearer ${this.token}`
                }, 
                body: JSON.stringify(newBoard)
            })
            .then(response => response.json())
            .then(data => {
                this.boardSingle = false
                this.getBoards()
            })
        },
        showList: function(e){
            const URL = this.prodURL ? this.prodURL : this.devURL
            console.log(this.boardID)
            fetch(`${URL}/boards/${this.boardID}/lists`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `bearer ${this.token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.boardSingle = true
                if (!data.response){
                    this.allLists = data
                    console.log(this.allLists)
                }
            })
        },
        createList: function(e){
            const URL = this.prodURL ? this.prodURL : this.devURL
            const list = {list_name: this.listInput}
            fetch(`${URL}/boards/${this.boardID}/lists`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `bearer ${this.token}`
                },
                body: JSON.stringify(list)
            })
            .then(response => response.json())
            .then(data => {
                this.showList()
                this.listInput=""
            })
        },
        createItem: function(e){
            const URL = this.prodURL ? this.prodURL : this.devURL
            this.listID = e.target.id
            console.log(this.listID)
            const itemInput = this.input[this.listID]
            console.log(itemInput)
            const item = {item_name: itemInput}
            fetch(`${URL}/boards/${this.boardID}/lists/${e.target.id}/items`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `bearer ${this.token}`
                },
                body: JSON.stringify(item)
            })
            .then(response => response.json())
            .then(data => {
                this.showItems()
                this.itemInput = ""
            })
        },
        showItems: function(e){
            const URL = this.prodURL ? this.prodURL : this.devURL
            fetch(`${URL}/boards/${this.boardID}/items`, {
                method: "get",
                headers: {
                    Authorization: `bearer ${this.token}`
                }
            })
            .then(response => response.json())
            .then(data => {
              this.allItems = data
              console.log(this.allItems)
            })
        },
        editItem: function(e){
            console.log(e.target.id)
            this.itemID = e.target.id
            this.listID = e.target.getAttribute('id2')
            console.log(this.itemID)
            console.log(this.listID)
            const item = this.allItems.find(item => {
                return item.id == this.itemID
            })
            this.updatingItem = item.item_name
            console.log(this.updatingItem)
        },
        updateItem: function(e){
            const URL = this.prodURL ? this.prodURL : this.devURL
            // this.listID = e.target.id
            // this.listID = this["list.id"]
            // console.log(this.listID)
            // console.log(this.itemID)
            const changeItem = {item_name: this.updatingItem}
            fetch(`${URL}/boards/${this.boardID}/lists/${this.listID}/items/${this.itemID}`, {
                method: "put",
                headers: {
                    Authorization: `bearer ${this.token}`
                },
                body: JSON.stringify(changeItem)
            })
            .then(response => response.json())
            .then(data => {
              if (!data.response){
                this.showItems()
            }
            })
        },
        deleteItem: function(e){
            const URL = this.prodURL ? this.prodURL : this.devURL
            this.itemID = e.target.id
            this.listID = e.target.getAttribute('id2')
            fetch(`${URL}/boards/${this.boardID}/lists/${this.listID}/items/${this.itemID}`, {
                method: "delete",
                headers: {
                    Authorization: `bearer ${this.token}`
                }
            })
            .then(response => response.json())
            .then(data => {
              if (!data.response){
                this.showItems()
            }
            })
        }
    }
})


// $(document).ready(function() {
//     const example2 = document.getElementById('all_lists_right');
//     new Sortable(example2, {
//         group: 'shared', 
//         animation: 150 // set both lists to same group animation: 150
//     });
// });


// $(document).ready(function() {
//     const example2Left = document.getElementById('all_lists_left');
//     const example2Right = document.getElementById('all_lists_right');
//     new Sortable(example2Left, {
//         group: 'shared', // set both lists to same group animation: 150
//     });
//     new Sortable(example2Right, {
//         group: 'shared',
//         animation: 150
//     });
// });