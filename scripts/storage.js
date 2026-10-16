const KEY = 'aouii:records';
// change list into text and save it 
function save(records) {
    localStorage.setItem(KEY, JSON.stringify(records));
    
}
// THis function will load back the saved records  
function load(){
    const text = localStorage.getItem(KEY);
    if (text=== null)  //if nothing is saved yet, return an empty list
        return [];
    try {
        return JSON.parse(text);
       
    }  catch{
            return [];    //catch damaged text to avoid crashing the app
        }
};
