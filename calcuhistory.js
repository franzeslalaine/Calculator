document.addEventListener("DOMContentLoaded", function() {

    let past = [];
    let historyList = document.getElementById("history");

    //loading array
    function load() {
        let saved = localStorage.getItem("myResult");
        if (saved !== null) {
            past = JSON.parse(saved); //from orig js file to array in second file
        }
    }

    //building history display using array
    function createList() {
    
        historyList.innerHTML = "";

        for (let i = 0; i < past.length; i++) {
            let li = document.createElement("li");
            li.textContent = past [i];

            let remove = document.createElement("button");
            remove.textContent = "x";
            remove.id = "remove-button"; //remove.className for classes
            remove.addEventListener("click", function() {
                removeTask(i)
            });

            li.appendChild(remove);
            historyList.appendChild(li);

        }

        //back button
        let back = document.createElement("button");
        back.textContent = "<<";
        back.id = "back-button"; 
        back.addEventListener("click", function() { 
            window.location.href = "index.html";
        })
        historyList.appendChild(back);

        //clear history
        if (past.length > 0) { 
            let button = document.createElement("button");
            button.textContent = "\u{1F5D1} Clear history";
            button.id = "clear-button";
            button.addEventListener("click", clearHistory);
            historyList.appendChild(button);
        } 

    }

    function removeTask (i) {
        past.splice(i, 1);
        localStorage.setItem("myResult", JSON.stringify(past));
        createList();
    }

    function clearHistory() {
        historyList.innerHTML = ""; // or document.getElementById("history").innerHTML = "";
        past = [];
        localStorage.removeItem("myResult"); //use removeItem if other things are stored; in this case, 'display'; clear for nuclear
        createList();
    }

    load ();
    createList();

});