

let abilitieNames = ["str","dex","con","int","wis","cha"];
let skillsNames = ["acrobatics","arcana","athletics","deception","history",
"insight","intimidation","investigation","medicine","nature",
"perception","performance","persuasion","religion","stealth","survival"]

function createStatBlock(name,obj){

  let variableToTitle = function(text){
    return text.replace(/_/," ").replace(/\b[a-z]/g,function(str){return str.toUpperCase()})
  }

  name = variableToTitle(name);

  filteredMonsters = monsters.filter(c=>c.name.length === name.length);

  let monster;
  if(obj){

    monster = obj;
  }else{
    monster = filteredMonsters.find(function(c){
      return c.name === name;
    });
  }

  if(!monster){

    let search = confirm("Creature not in monsterdex. search aidedd?");
    if(search){
      let searchName = name.toLowerCase().replace(/ /g,"-");
      window.open("http://www.aidedd.org/dnd/monstres.php?vo="+searchName);
    }
    return;
  }

  //create Element
  let ce = function(name,text){
    let e = document.createElement(name);
    e.innerHTML = text;
    return e;
  }

  //create property-line or property-block
  let cProperty = function(type,title,content){
    let block = ce(type,"");
    let h4 = ce("h4",title+" ");
    let p = ce("p",content);
    block.appendChild(h4);
    block.appendChild(p);
    return block;
  }

  let cInfo = function(){
    let size= monster.size+" ",
        type= monster.type,
        subtype= monster.subtype===""?"":(" ("+monster.subtype+")");
        alignment=", "+monster.alignment;

    let str = size+type+subtype+alignment;
    return ce("h2",str);
  }

  let cAbilities = function(){
    let aStats =
    [monster.strength,
    monster.dexterity,
    monster.constitution,
    monster.intelligence,
    monster.wisdom,
    monster.charisma]

    let aBlock = ce("abilities-block","");
    for(let i = 0;i<6;i++){
      let a = document.createAttribute("data-"+abilitieNames[i]);
      a.value = aStats[i];
      aBlock.setAttributeNode(a);
    }

    return aBlock;
  }

  let cHP = function(){
    let averages = {
      "Tiny":2.5,
      "Small":3.5,
      "Medium":4.5,
      "Large":5.5,
      "Huge":6.5,
      "Gargantuan":10.5
    }

    let intHitDice = monster.hit_dice.match(/\d+/g);
    let hitDiceAverage = intHitDice[0]*averages[monster.size];
    let plus = Math.round(monster.hit_points-hitDiceAverage);

    return cProperty("property-line","Hit Points",monster.hit_points+" ("+monster.hit_dice+" + "+plus+")")
  }

  let cOccationnalProperty = function(property){
    if(monster[property]!=="" && monster[property]){

      return cProperty("property-line",variableToTitle(property),monster[property]);
    }else{
      return null;
    }
  }

  let cChallenge = function(){
    let crToXp={
      "0":10,"1/8":25,"1/4":50,"1/2":100,"1":200,"2":450,"3":700,"4":1100,
      "5":1800,"6":2300,"7":2900,"8":3900,"9":5000,"10":5900,"11":7200,"12":8400,
      "13":10000,"14":11500,"15":13000,"16":15000,"17":18000,"18":20000,"19":22000,
      "20":25000,"21":33000,"22":41000,"23":50000,"24":62000,"25":75000,"26":90000,
      "27":105000,"28":120000,"29":135000,"30":155000
    }
    return cProperty("property-line","Challenge",monster.challenge_rating+" ("+crToXp[monster.challenge_rating]+" XP)")
  }

  let propertyBlocks= function(array){
    let blocks = [];
    if(array){
      array.forEach(function(c){
        blocks.push(cProperty("property-block",c.name,c.desc))
      })
      return blocks;
    }
    return null
  }

  let cSaves = function(){
    let saves = [];

    if(!isNaN(monster.strength_save)){
      saves.push( " Str +"+monster.strength_save);
    }
    if(!isNaN(monster.dexterity_save)){
      saves.push( " Dex +"+monster.dexterity_save);
    }
    if(!isNaN(monster.constitution_save)){
      saves.push(" Con +"+monster.constitution_save);
    }
    if(!isNaN(monster.intelligence_save)){
      saves.push(" Int +"+monster.intelligence_save);
    }
    if(!isNaN(monster.wisdom_save)){
      saves.push( " Wis +"+monster.wisdom_save);
    }
    if(!isNaN(monster.charisma_save)){
      saves.push( " Cha +"+monster.charisma_save);
    }

    if(!saves.length)return null;
    return cProperty("property-line","Saving Throws",saves.join(", "));
  }

  let cSkills = function(){

    let strArray = [];

    skillsNames.forEach(function(c){
      if(!isNaN(monster[c])){
        strArray.push(variableToTitle(c)+" +"+monster[c]);
      }
    })
    if(!strArray.length)return null;
    return cProperty("property-line","Skills",strArray.join(", "));
  }

  let statBlock = ce("stat-block","");

  //create blocks
  let creatureHeading = ce("creature-heading",""),
      creatureName = ce ("h1",monster.name),
      creatureInfo = cInfo(),
      topStats = ce("top-stats",""),
      ac = cProperty("property-line","Armor Class",monster.armor_class),
      hp = cHP(),
      speed = cProperty("property-line","Speed",monster.speed),
      abilitiesBlock = cAbilities(),
      saves = cSaves(),
      skills = cSkills(),
      dmgVulnerabilities = cOccationnalProperty("damage_vulnerabilities"),
      dmgResistances = cOccationnalProperty("damage_resistances"),
      dmgImmunities = cOccationnalProperty("damage_immunities"),
      conditionImmunities = cOccationnalProperty("condition_immunities"),
      senses = cProperty("property-line","Senses",monster.senses),
      languages = cProperty("property-line","Languages",monster.languages===""?"-":monster.languages),
      challenge = cChallenge();


  creatureHeading.appendChild(creatureName);
  creatureHeading.appendChild(creatureInfo);
  topStats.appendChild(ac);
  topStats.appendChild(hp);
  topStats.appendChild(speed);
  topStats.appendChild(abilitiesBlock);

  if(saves)topStats.appendChild(saves);
  if(skills)topStats.appendChild(skills);
  if(dmgVulnerabilities)topStats.appendChild(dmgVulnerabilities);
  if(dmgResistances)topStats.appendChild(dmgResistances);
  if(dmgImmunities)topStats.appendChild(dmgImmunities);
  if(conditionImmunities)topStats.appendChild(conditionImmunities);

  topStats.appendChild(senses);
  topStats.appendChild(languages);
  topStats.appendChild(challenge);

  let specialAbilities = propertyBlocks(monster.special_abilities),
      actionSection = ce("h3","Actions"),
      actions = propertyBlocks(monster.actions),
      reactionSection = ce("h3","Reactions"),
      reactions = propertyBlocks(monster.reactions),
      legendaryActionSection = ce("h3","Legendary Actions"),
      legendaryRule =ce("p","The "+monster.name+
      " can take 3 legendary actions, choosing from the options below. Only one "+
      "legendary action option can be used at a time and only at the end of another "+
      "creature's turn. The "+ monster.name+" regains spent legendary actions at the "+
      "start of its turn."),
      legendaryActions =  propertyBlocks(monster.legendary_actions);

  //place blocks
  statBlock.appendChild(creatureHeading);
  statBlock.appendChild(topStats);

  if(specialAbilities)specialAbilities.forEach(function(c){statBlock.appendChild(c)})

  if(actions){
    statBlock.appendChild(actionSection);
    actions.forEach(function(c){statBlock.appendChild(c)})
  }
  if(reactions){
    statBlock.appendChild(reactionSection);
    reactions.forEach(function(c){statBlock.appendChild(c)})
  }
  if(legendaryActions){
    statBlock.appendChild(legendaryActionSection);
    statBlock.appendChild(legendaryRule);
    legendaryActions.forEach(function(c){statBlock.appendChild(c)})
  }
  document.querySelector(".content").insertBefore(statBlock,document.querySelector(".content").firstElementChild);
}

function showControlList(button){
  let list = document.querySelector(".controls ul")
  if(list.style.display === "none" || list.style.display === "" ){
    list.style.display = "block"
    button.children[0].innerHTML = "hide";
  }else{
    list.style.display = "none";
    button.children[0].innerHTML = "show";
  }
}

function doneCreatureMenu(m,menu){
  menu.style.display = "none";
  menu.className = "";
  createStatBlock(m);
}

function mapObjArray(objArray,indexProperty,identificationProperty,sortObj){

  return objArray.map(c=>[c[indexProperty],c[identificationProperty]]).sort(function(a,b){
    if(sortObj){
      return sortObj[a[0]]-sortObj[b[0]];
    }
    let textA = a[0].toUpperCase();
    let textB = b[0].toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  })
}

//----------------------------------------------------------------------------------------------------------------------------------------

window.onload = function(){



  let monsterInput = document.querySelector(".monsterInput"),
      parent = null,
      mode = "",
      CurrentTarget = null,
      dataList = document.createElement("datalist"),
      controlDown = false;

  dataList.id = "monsters";

  (function(){

    let buttons = document.querySelectorAll(".button"),
        buttonNpc = buttons[0],
        buttonMiscellaneous = buttons[1],
        buttonFavorites =  buttons[2],
        buttonChallenge = buttons[3],
        buttonType = buttons[4];

    buttonNpc.onclick = function(e){setCreatureMenu("npcs",e)}
    buttonMiscellaneous.onclick = function(e){setCreatureMenu("miscellaneous",e)}
    buttonFavorites.onclick = function(e){setCreatureMenu("favorites",e)}
    buttonChallenge.onclick = function(e){setCreatureMenu("challenge",e)}
    buttonType.onclick = function(e){setCreatureMenu("type",e)}

    document.body.appendChild(dataList);
    let a = document.createAttribute("list");
    a.value = dataList.id;
    monsterInput.setAttributeNode(a);

    monsterInput.onkeypress = function(e){

      if(e.code === "Enter"){
        let str = monsterInput.value.replace(/\b[a-z]/g,function(str){return str.toUpperCase()})
        createStatBlock(str);
        monsterInput.value = "";
        mode = "";
      }
    }
    monsterInput.onclick = function(){
      mode = "writting";
    }
    monsterInput.onblur = function(){
      mode = "";
    }
  })()

  let creatureTypes = {
    npcs:[
      ["Acolyte", "Archmage", "Assassin"],
      ["Bandit", "Bandit Captain","Berserker"],
      ["Commoner", "Cult Fanatic", "Cultist"],
      ["Druid"],
      ["Gladiator","Guard"],
      ["Knight"],
      ["Mage"],
      ["Noble"],
      ["Priest"],
      ["Scout", "Spy"],
      [ "Thug","Tribal Warrior"],
      ["Veteran"]
    ],
    miscellaneous:[
      ["Ape", "Awakened Shrub", "Awakened Tree", "Axe Beak"],
      [  "Baboon", "Badger", "Bat", "Black Bear", "Blink Dog", "Blood Hawk",
      "Boar", "Brown Bear"],
      ["Camel", "Cat", "Constrictor Snake", "Crab", "Crocodile"],
      ["Death Dog", "Deer", "Dire Wolf", "Diseased Giant Rats", "Draft Horse"],
      ["Eagle", "Elephant", "Elk"],
      ["Flying Snake", "Frog"],
      ["Giant Ape", "Giant Badger", "Giant Bat", "Giant Boar", "Giant Centipede",
      "Giant Constrictor Snake", "Giant Crab", "Giant Crocodile", "Giant Eagle",
      "Giant Elk", "Giant Fire Beetle", "Giant Frog", "Giant Goat", "Giant Hyena",
      "Giant Lizard", "Giant Octopus", "Giant Owl", "Giant Poisonous Snake",
      "Giant Rat", "Giant Scorpion", "Giant Sea Horse", "Giant Shark",
      "Giant Spider", "Giant Toad","Giant Two-Headed Goat", "Giant Vulture", "Giant Wasp",
      "Giant Weasel", "Giant Wolf Spider", "Goat"],
      ["Hawk", "Hunter Shark","Hyena"],
      ["Jackal"],
      ["Killer Whale"],
      ["Lion", "Lizard"],
      ["Mammoth","Mastiff", "Mule"],
      ["Octopus", "Owl"],
      ["Panther", "Phase Spider",
      "Poisonous Snake", "Polar Bear", "Pony"],
      ["Quipper"],
      ["Rat", "Raven", "Reef Shark", "Rhinoceros", "Riding Horse"],
      ["Saber-Toothed Tiger", "Scorpion", "Sea Horse", "Spider",
      "Swarm of Bats", "Swarm of Insects", "Swarm of Poisonous Snakes",
      "Swarm of Quippers", "Swarm of Rats","Swarm of Ravens"],
      ["Tiger"],
      ["Vulture"],
      ["Warhorse", "Weasel","Wild Dog","Wild Dog Alpha", "Winter Wolf", "Wolf", "Worg"]
    ]
  }

  if(localStorage.getItem("favorites")){

    creatureTypes.favorites = JSON.parse(localStorage.getItem("favorites"));
  }else{
    creatureTypes.favorites = [];
  }

  function setCreatureMenu(option){
    removeMenu()

    let menu = document.getElementById("creatureMenu");
    if(menu.className === option){
      menu.className = "";
      menu.style.display = "none";
      document.activeElement.blur();
      return;
    }

    let cItem = function(c,i){
      let item = document.createElement("li");
      let text = document.createTextNode(c);
      if(i==0)item.classList.toggle("firstListItem");
      item.classList.toggle("creatureItems");
      item.onclick = function(){doneCreatureMenu(c,document.getElementById('creatureMenu'))};
      item.appendChild(text);
      return item;
    }

    let initList = function(str){
      let list = document.createElement("list");
      let caption = document.createElement("caption");
      let text = document.createTextNode(str);
      caption.style.fontSize = "20px"
      caption.className = "creatureListCaptions";
      list.classList.toggle("creatureLists");
      caption.appendChild(text);
      list.appendChild(caption);
      return list;
    }

    if(option === "challenge" || option === "type"){

      dataArray = mapObjArray(monsters,option==="challenge"?"challenge_rating":"type","name",
      option==="challenge"?{
        "0":1,"1/8":2,"1/4":3,"1/2":4,"1":5,"2":6,"3":7,"4":8,
        "5":9,"6":10,"7":11,"8":12,"9":13,"10":14,"11":15,"12":16,
        "13":17,"14":18,"15":19,"16":20,"17":21,"18":22,"19":23,
        "20":24,"21":25,"22":26,"23":27,"24":28,"25":29,"26":30,
        "27":31,"28":32,"29":33,"30":34
      }:null);

      let currentCategory = dataArray[0][0];
      let items = [];
      let list;

      for(let i = 0;i<=dataArray.length;i++){
        let category = dataArray[i]?dataArray[i][0]:"";
        if(category!==currentCategory || i===dataArray.length){
          list = initList(currentCategory);
          items.sort().forEach(function(c,i){list.appendChild(cItem(c,i));})
          items = [];
          menu.appendChild(list);
          if(dataArray.length===i)break;
          currentCategory = dataArray[i][0];
        }
        items.push(dataArray[i][1]);
      }


    }else{
      creatureTypes[option].forEach(function(a){

        let list = initList(a[0].substr(0,1)+"");

        a.forEach(function(c,i){
          list.appendChild(cItem(c,i));
        })

        menu.appendChild(list);
      })
    }

    menu.style.display = "block";
    menu.className = option;
  }

  function removeMenu(){
    let array = document.querySelectorAll(".creatureLists");
    array.forEach(function(c){c.remove()});
  }

  let strMonsters = JSON.stringify(monsters);

  if(!localStorage.getItem("monstersClone")){
    localStorage.setItem("monstersClone",strMonsters);
  }

  if(localStorage.getItem("monstersClone") !== strMonsters){
    localStorage.removeItem("monsters");
    localStorage.setItem("monstersClone",strMonsters);
  }

  if(!localStorage.getItem("monsters")){
    localStorage.setItem("monsters",strMonsters);
  }else{
    monsters = JSON.parse(localStorage.getItem("monsters"));
  }





  function updateStorage(){
    localStorage.setItem("monsters",JSON.stringify(monsters));
  }

  function dataListUpdate(){

    while (dataList.firstElementChild) {
      dataList.removeChild(dataList.firstElementChild);
    }
    monsters.forEach(function(c){
      let option = document.createElement("option");
      option.value = c.name;
      dataList.appendChild(option);
    })
  }dataListUpdate();

  // url thingy;
  let query = window.location.search.substring(1);
  if(query!==""){
    let urlMonsters = [];
    urlMonsters = query.split(",").reverse();

    urlMonsters.forEach(function(c){
        let str = c.replace(/%20/g," ");
        createStatBlock(str);
    })
  }

  function getInitiative(){
    let statBlocks = document.querySelectorAll("stat-block");
    let initiatives = [];

    statBlocks.forEach(function(c){
      let name = c.innerText.match(/.*(?=\n)/)[0];
      let dex = monsters.find(m=>m.name === name).dexterity;
      initiatives.push({name:name,init:(Math.floor((dex-10)/2))+Math.round(Math.random()*20)});
    })

    let str = "";
    initiatives.forEach(function(o){
      str+= o.name+": "+o.init+"\n";
    })
    alert("-INITIATIVES- \n"+str);
  }

  function statBlockToJSON(statBlock){

    let findStrBetween = function (subStr1,subStr2,str){

      let findStr = function(subStr){
        let array = [];
        let index = 0;
        let nextIndex = 0;
        do{
          index = str.indexOf(subStr,nextIndex);
          if(index === -1)break;
          nextIndex = index+subStr.length;
          array.push(index);
        }while(true)
        return array;
      }

      let opening = findStr(subStr1);
      let closing = findStr(subStr2);
      let between = [];

      for(let i = 0; i< opening.length;i++){
        between.push(str.substring(opening[i]+subStr1.length,closing[i]))
      }

      return between;
    }


    let data = {},
        children = statBlock.children,
        heading = children[0].innerText.split("\n"),
        wordMatch = heading[1].match(/\w+/g);

    data.name = heading[0];
    data.size = wordMatch[0];
    data.type = wordMatch[1];
    data.subtype = heading[1].includes("(")?heading[1].match(/\((.*)\)/)[0].replace(/(\(|\))/g,""):"";
    data.alignment = heading[1].match(/,.*/)[0].match(/\w+/g).join(" ");

    let abilitieFullNames = ["strength","dexterity","constitution","intelligence","wisdom","charisma"],
        topStatsHTML = children[1].innerHTML,
        propertyLineNames = findStrBetween("<h4>","</h4>",topStatsHTML).map(c=>c.trim().toLowerCase().replace(/ /g,"_")),
        propertyLineValues = findStrBetween("<p>","</p>",topStatsHTML),
        rawAbilities = children[1].children[3].attributes,
        properties = [],
        currentPropertyType = "special_abilities",
        monsterIndex = monsters.findIndex(c=>c.name === data.name),
        textFile = null;

    propertyLineNames.forEach(function(c,i){

      switch(c){
        case "challenge":
          data.challenge_rating = propertyLineValues[i].split(" ")[0];
        break;
        case "saving_throws":
          propertyLineValues[i].split(",").map(str=>str.trim().split(" ")).forEach(function(save){
            let name = abilitieFullNames[abilitieNames.indexOf(save[0].toLowerCase())];
            let value = parseInt(save[1]);

            data[name+"_save"] = value;
          })
        break;
          case "skills":
          propertyLineValues[i].split(",").map(str=>str.trim().split(" ")).forEach(function(skill){
            data[skill[0].toLowerCase()] = parseInt(skill[1]);
          })
        break;
        case "armor_class":
          data[c] = parseInt(propertyLineValues[i]);
        break;
        case "hit_points":
          data.hit_dice = propertyLineValues[i].match(/\d+d\d+/)[0];
          data[c] = parseInt(propertyLineValues[i].match(/\d+/)[0]);
        break
        default:
          data[c] = propertyLineValues[i];
      }
    })

    for(let i =0;i<rawAbilities.length;i++){
      data[abilitieFullNames[i]] = parseInt(rawAbilities.item(i).nodeValue);
    }

    for(let i = 2; i<children.length;i++){
      let cChild = children[i];
      if(cChild.localName === "h3"){
        currentPropertyType = cChild.innerHTML.toLowerCase().replace(/ /,"_");
      }
      if(cChild.localName === "property-block"){
        let propertyHTML = cChild.innerHTML;
        let name = findStrBetween("<h4>","</h4>",propertyHTML)[0].trim();
        let desc = findStrBetween("<p>","</p>",propertyHTML)[0].trim();
        properties.push({propertyType:currentPropertyType,name:name,desc:desc});
      }
    }

    properties.forEach(function(c){
      if(!data[c.propertyType]){
        data[c.propertyType] = [];
      }
      data[c.propertyType].push({name:c.name,desc:c.desc});
    })

    if(monsterIndex === -1){
      monsters.push(data);
      monsters.sort(function(a,b){
        let textA = a.name.toUpperCase();
        let textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      })
      dataListUpdate();
      alert(data.name+" created and saved");
    }else{
      monsters[monsterIndex] = data;
      alert(data.name+" updated");
    }
    updateStorage();

    (function(obj){

      let text = "monsters = "+ JSON.stringify(obj);
      let data = new Blob([text], {type: 'text/plain'});

      // If we are replacing a previously generated file we need to
      // manually revoke the object URL to avoid memory leaks.
      if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
      }

      textFile = window.URL.createObjectURL(data);

      // returns a URL you can use as a href
      let a = document.querySelector("body p a");

      a.href = textFile;
      a.download = "monsters.js";

    })(monsters);
  }

  function resetSelected(target){
    if(target)target.id = "";
    parent = null;
    CurrentTarget = null;
  }

  function resetSet (target,p){

    if(target!== CurrentTarget){
      resetSelected(CurrentTarget);
      parent = p;
      target.id = "selected";
      CurrentTarget = target;
      setControlList("propertyBlock");
    }else{
      resetSelected(target);
      setControlList("notText");
    }
  }

  function setControlList(option){
    let list = document.querySelector(".controls ul");
    let items = document.querySelectorAll(".controls ul li");
    items.forEach(c=>c.remove());

    let controls = {
      statBlock:["S: save/update","D: delete from list","G: google it","F: add/remove favorites",
      "ArrowRight: change width+","ArrowLeft: change width-","Enter: done"],
      block:["Backspace: delete block","ArrowUp: move up","ArrowDown: move down"],
      property:["E: edit"],
      text:["Enter: done"],
      notText:["I: get initiatives"]
    }

    let setting = {
      statBlock: controls.statBlock.concat(controls.block).concat(controls.notText),
      propertyBlock: controls.block.concat(controls.property).concat(controls.notText),
      text:controls.text,
      notText: controls.notText
    }

    setting[option].forEach(function(c){
      let li = document.createElement("li");
      let text = document.createTextNode(c);
      li.appendChild(text);
      list.appendChild(li);
    })

  }setControlList("notText");

  function select(){

    if(mode!="")return;

    let parentName = event.target.parentNode.localName;
    let targetName = event.target.localName;
    let parentClass = event.target.parentNode.className;

    if(controlDown){

      let currentNode = event.target;
      while(currentNode.localName!="body"){

        currentNode = currentNode.parentNode;
        if(currentNode.localName==="stat-block"){
          resetSet(currentNode,currentNode.parentNode)
          moveStat(currentNode,parent);
          return;
        }
      }
    }

    if(targetName==="h4" || targetName==="p" || targetName==="h3" ){
      if(parentName === "top-stats"|| parentName==="property-block" || parentName==="property-line"){
        resetSet(event.target.parentNode,event.target.parentNode.parentNode);
      }else if(parentName === "stat-block") {
        resetSet(event.target,event.target.parentNode);
      }
    }else{

      if(parentName === "creature-heading"){
        resetSelected(CurrentTarget);
        modProperty(event.target);
      }else if( targetName === "abilities-block"){
        resetSelected(CurrentTarget);
        abilityMod(event.target);
      }else if(parentClass == "content" && targetName=="stat-block"){
        resetSet(event.target,event.target.parentNode)
        moveStat(event.target,parent);
      }
    }
  }

  function moveStat(target){

    let pressedKey = {};

    setControlList(["statBlock"])
    mode = "moveStat";

    let done = function(){
      resetSelected(CurrentTarget);
      mode = "";
      document.removeEventListener("keydown",keyDown);
      document.removeEventListener("click",done);
      setControlList("notText")
    }

    let keyDown = function(event){

      if(event.code === "ArrowLeft"){
        changeDim(target,"width",-330)
        event.preventDefault();
      }

      if(event.code === "ArrowRight"){
        changeDim(target,"width",330)
        event.preventDefault();
      }

      if(event.code === "Enter"){
        done();
      }

      if(event.code === "KeyS"){
        statBlockToJSON(target);
      }

      if(event.code === "KeyG"){
        let question = (target.children[0].children[0].innerText+" d%26d").replace(" ","%20");
        window.open("https://www.google.ca/search?q="+question+"&tbm=isch");
      }

      if(event.code === "KeyD"){
        let name = target.children[0].children[0].innerHTML;
        let index = monsters.findIndex(c=>c.name===name);

        if(index!=-1){
          monsters.splice(index,1);
          dataListUpdate();
          updateStorage();
          alert(name+" deleted");
        }else{
          alert(name+" is not saved");
        }
      }

      if(event.code === "KeyF"){
        let name = target.children[0].children[0].innerHTML;
        let fav = creatureTypes.favorites;
        let aSort = function(a,b){
          let al = {A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:10,K:11,L:12,M:13,
                  N:14,O:15,P:16,Q:17,R:18,S:19,T:20,U:21,V:22,W:23,X:24,Y:25,Z:26};

          return al[a[0].split("")[0]]-al[b[0].split("")[0]];
        };

        if(fav.length===0){
          fav.push([name]);
          alert(name+" added to favorites");
        }else{
          let index = -1;
          for(let i=0;i<fav.length;i++){
            if(fav[i][0].split("")[0]===name.split("")[0]){
              index = i;
              break;
            }
          }

          if(index === -1){
            fav.push([name]);
            alert(name+" added to favorites");
          }else{
            let same = fav[index].findIndex(c=>c===name);
            if(same !==-1){
              fav[index].splice(same,1);
              if(fav[index].length===0){
                fav.splice(index,1);
              }
              alert(name+" removed from favorites");
            }else{
              fav[index].push(name);
              fav[index].sort();
              alert(name+" added to favorites");
            }
          }
          fav.sort(aSort);
        }

        if(document.getElementById("creatureMenu").className === "favorites"){
          setCreatureMenu("favorites");
        }
        localStorage.setItem("favorites",JSON.stringify(fav));
      }
    }

    let statBlockRect = target.getBoundingClientRect();

    document.addEventListener("keydown",keyDown);
    document.addEventListener("click",done);
  }

  function changeDim(block,woh,value){
    let intV = parseInt(block.shadowRoot.styleSheets[0].rules[2].style[woh]);
    block.shadowRoot.styleSheets[0].rules[2].style[woh] = (intV+value)+"px";
  }

  function abilityMod(target){
    modProperty(target,"abilities");
  }

  function variableToTitle(text){
    return text.replace(/_/," ").replace(/\b[a-z]/g,function(str){return str.toUpperCase()})
  }

  function modProperty(target,type){

    if(!target)return;
    setControlList("text");
    let textBox = document.createElement("textarea");
    let targetInfo = target.getBoundingClientRect();
    let offset = $(target).offset();

    textBox.style.zIndex = 3;
    textBox.style.position = "absolute";
    textBox.style.width = targetInfo.width+"px";

    mode = "writting";
    textBox.style.top = offset.top+"px";
    textBox.style.left = offset.left+"px";
    textBox.style.height = targetInfo.height+"px";

    if(type === "abilities"){

      let abilities = {};

      for(let i =0; i<6;i++){
        textBox.value += abilitieNames[i]+" = "+target.attributes.item(i).nodeValue+" | ";
      }

    }else{
      textBox.value = target.innerHTML;
    }

    document.body.appendChild(textBox);
    let done = function(){
      setControlList("propertyBlock");
      if(event.code === "Enter" || (event.type === "click" && event.target!==textBox) ){
        if(type === "abilities"){
          let tParent = target.parentNode;
          let sibling = target.previousElementSibling;
          target.remove();
          let aBlock = document.createElement("abilities-block");
          let data = textBox.value.match(/\d+/g);

          for(let i = 0;i<6;i++){
            let a = document.createAttribute("data-"+abilitieNames[i]);
            a.value = data[i];
            aBlock.setAttributeNode(a);
          }

          tParent.insertBefore(aBlock, sibling.nextSibling);

        }else{
          let value = textBox.value;
          if(target.localName==="h1"){
            value = variableToTitle(value);
          }
          target.innerHTML = value;
        }
        textBox.remove();
        mode="";
        document.removeEventListener("keydown",done);
        document.removeEventListener("click",done);
      }
    }

    document.addEventListener("keydown",done);
    document.addEventListener("click",done);
  }

  function mod(target,type){

    resetSelected(CurrentTarget);
    let input = document.createElement("input");
    let done = function(){
      if(event.code === "Enter" || (event.type === "click" && event.target!==input) ){
        if(type === "abilities"){

          let tParent = target.parentNode;
          let sibling = target.previousElementSibling;
          let aBlock = document.createElement("abilities-block");
          let data = input.value.match(/\d+/g);
          target.remove();

          for(let i = 0;i<6;i++){

            let a = document.createAttribute("data-"+abilitieNames[i]);
            a.value = data[i];
            aBlock.setAttributeNode(a);
          }

          tParent.insertBefore(aBlock, sibling.nextSibling);
        }else{

          target.innerHTML=input.value;
        }

        input.remove();
        mode = "";
        document.removeEventListener("keydown",done);
        document.removeEventListener("click",done);
      }
    }
    let targetInfo = target.getBoundingClientRect();
    mode = "renaming";
    input.type = "text";

    if(type === "abilities"){

      let abilities = {};

      for(let i =0; i<6;i++){
        input.value += abilitieNames[i]+" = "+target.attributes.item(i).nodeValue+" | ";
      }

    }else{
      input.value = target.innerHTML;
    }

    input.style.position = "absolute";
    input.style.width = targetInfo.width+"px";
    input.style.top = targetInfo.top+"px";
    input.style.left = targetInfo.left+"px";
    input.style.height = targetInfo.height+"px";
    document.body.appendChild(input);
    document.addEventListener("keydown",done);
    document.addEventListener("click",done);
  }

  function removeChildsPlaceInArray(parent){

    let list = [];
    let width = [];
    while (parent.firstElementChild) {
      list.push(parent.firstElementChild);
      if(parent.firstElementChild.shadowRoot && parent.className === "content"){
        width.push(parent.firstElementChild.shadowRoot.styleSheets[0].rules[2].style.width)
      }else{
        width.push("");
      };
      parent.removeChild(parent.firstElementChild);
    }
    return {list:list,width:width};
  }

  function placeArray(parent,array){

    array.list.forEach(function(c,i){

      parent.appendChild(c);
      if(array.width[i]!=="")c.shadowRoot.styleSheets[0].rules[2].style.width = array.width[i];

    })
  }

  function findSelected(array){

    for(let i=0;i<array.length;i++){
      if(array[i].id === "selected"){
        return i;
      }
    }
  }

  function moveElement(dir,event){

    if(parent ){
      let nodes = removeChildsPlaceInArray(parent);
      let index = findSelected(nodes.list);
      let selected = nodes.list[index];
      let newIndex;
      if(dir == "up"){
        newIndex = index-1<0?index:index-1;

      }else{
        newIndex = index+1>nodes.length?index:index+1;
      }
      nodes.list.splice(index,1);
      nodes.list.splice(newIndex,0,selected);
      if(nodes.width.length){
        selected = nodes.width[index];
        nodes.width.splice(index,1);
        nodes.width.splice(newIndex,0,selected);
      }
      placeArray(parent,nodes);
      event.preventDefault()
    }
  }

  function copyElement(target){

    if(!target)return;
    let copy = target.cloneNode(true);
    copy.id = "";
    target.parentNode.insertBefore(copy,target.nextElementSibling);
    //resetSet(copy,target.parentNode);
  }

  function removeSelected(target){

    if(!target)return;
    resetSelected(target);
    target.remove();
  }

  function updown(event){

    if(event.code === "ControlLeft"){
      controlDown = true;
    }

    if(mode === ""){

      switch(event.code){
        case "KeyE":
          modProperty(CurrentTarget)
        break;
      }

    }

    if(mode!=="writting" && mode!=="renaming"){

      switch(event.code){
        case "ArrowUp":
          moveElement("up",event);
        break;
        case "ArrowDown":
          moveElement("down",event);
        break;
        case "KeyC":
          copyElement(CurrentTarget);
        break;
        case "Backspace":
          removeSelected(CurrentTarget);
        break;
        case "KeyI":
          getInitiative();
        break;
        case "Escape":
          let menu = document.getElementById("creatureMenu");
          if(menu.className !== ""){
            document.getElementById(menu.className+"Button").blur();
            menu.className = "";
            menu.style.display = "none";
          }
        break;
      }
    }
  }

  document.addEventListener("click",select);
  document.addEventListener("keydown",updown);
  document.addEventListener("keyup",function(event){
    if(event.code === "ControlLeft")controlDown=false;
  })
}
