let appData=[] ;
 
function save(appData) {
    let text = JSON.stringify(`${appData}: text`);
    localStorage.setItem(text);
};

function load(){

};
