///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                      ~ MADE BY DEJAN MARIC ~                                                          //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function() {

    //Init game window
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'puzzle-game', { preload: preload, update: update, create: create});

    //Global vars
    var temp_item;
    var items;
    var temp_x;
    var temp_y;
    var temp_line;
    var lines;
    var count;

    //Preload images
    function preload() {
        game.load.image('1', 'img/1.png');
        game.load.image('2', 'img/2.png');
        game.load.image('3', 'img/3.png');
        game.load.image('4', 'img/4.png');
        game.load.image('5', 'img/5.png');
        game.load.image('6', 'img/6.png');
        game.load.image('7', 'img/7.png');
        game.load.image('8', 'img/8.png');
        game.load.image('img_background', 'img/bg.png');
        game.load.image('img_title', 'img/title.png');
        game.load.image('img_blanket', 'img/blanket.png');
        game.load.image('img_box', 'img/box.png');
        game.load.image('img_message', 'img/message.png');
        game.load.image('btn_reset', 'img/btn_reset.png');
        game.load.image('btn_fullscreen', 'img/btn_fullscreen.png');
    }

    //Init function
    function create() {

        game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;
        items_size = 8;
        count = 0;

        background = game.add.sprite(0, 0, 'img_background');
        blanket = game.add.sprite(40, 140, 'img_blanket');
        box = game.add.sprite(243, 193, 'img_box');
        
        lines = game.add.group();

        createLine(245,195,555,195);
        createLine(555,195,555,505);
        createLine(555,505,245,505);
        createLine(245,505,245,195);

        items = game.add.group();

        createItem(60,150,1);
        createItem(60,320,2);
        createItem(50,450,3);
        createItem(180,180,4);
        createItem(570,340,5);
        createItem(570,150,6);
        createItem(660,210,7);
        createItem(580,480,8);

        txt_author = game.add.text(game.world.centerX - 65, 565, 'Made by Dejan Marić', { font: '14px Bree Serif', fill: '#ffffff' });
        message = game.add.sprite(130, 15, 'img_title');
        button = game.add.button(25, 35, 'btn_reset', resetOnClick, this, 2, 1, 0);
        button2 = game.add.button(game.world.width - 115, 35, 'btn_fullscreen', fullOnClick, this, 2, 1, 0);
        message = game.add.sprite(0, 90, 'img_message');
    }

    //Update function, that updates screen realtime
    function update() {
        //Checking items/blocks if they are placed valid
        count = 0;
        items.forEach(function(item) {
            if(item.validPlace)
            {
                count++;
            }
        }); 
        if(count == items_size) {
            message.visible = true;
            //Disable item/block moving if player win
            items.forEach(function(item) {
                item.inputEnabled = false;
            });
        } else {
            message.visible = false;
        }
    }

    //----MOUSE----\\
    //Get's mouse start position x and y
    function dragStart(obj,pointer,x,y) {
        temp_x = x;
        temp_y = y;
    }
    //Updates mouse position
    function dragUpdate(obj) {
        //Snap effect inside of 5x5 grid
        if((obj.x > 240) && (obj.x < 510) && (obj.y > 180) && (obj.y < 470)) {
            obj.input.enableSnap(60, 60, false, true);
            obj.input.snapOffsetX = 256;
            obj.input.snapOffsetY = 206;
        }
        else {
            obj.input.disableSnap();
        }
        items.forEach(function(item) {       
            //Hover item/block effect
            if(obj.name != item.name)
            {
                if (checkOverlap(obj, item)) {
                    item.alpha = 0.7;
                }
                else {
                    item.alpha = 1;
                }
            }
        });

    }
    //Drag stopped
    function dragStop(obj) {
        items.forEach(function(item) {       
            //Hover effect and getting item back on start position because move was no valid
            if(obj.name != item.name) {
                if (checkOverlap(obj, item)) {
                    obj.x = temp_x;
                    obj.y = temp_y;
                }
            }
            //Hover tweak - reseting alpha of all items back to default
            item.alpha = 1;
        });
        //Snap effect inside of 5x5 grid
        if((obj.x > 240) && (obj.x < 510) && (obj.y > 180) && (obj.y < 470)) {
            obj.input.enableSnap(60, 60, false, true);
            obj.input.snapOffsetX = 256;
            obj.input.snapOffsetY = 206;
            obj.validPlace = true;
        }
        else {
            obj.input.disableSnap();
            obj.validPlace = false;
        }
        //If it touches the line then it's not valid placement
        lines.forEach(function(line) {
            if(checkOverlap(obj,line)){
                obj.x = temp_x;
                obj.y = temp_y;
            }
        });
    }

    //----CHECK----\\
    //Checking sprites overlap
    function checkOverlap(spriteA, spriteB) {

            var angleBlockA = false;
            var angleBlockB = false;
            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();
            
            if(spriteA.name == 6) {
                    var boundsA1 = new Phaser.Rectangle(spriteA.x, spriteA.y, spriteA.width, 50) ;
                    var boundsA2 = new Phaser.Rectangle(spriteA.x, spriteA.y, 50, spriteA.height) ;
                    angleBlockA = true;
            }
            else if(spriteB.name == 6) {
                    var boundsB1 = new Phaser.Rectangle(spriteB.x, spriteB.y, spriteB.width, 50) ;
                    var boundsB2 = new Phaser.Rectangle(spriteB.x, spriteB.y, 50, spriteB.height) ;
                    angleBlockB = true;
            }
            if(spriteA.name == 2) {
                    var boundsA1 = new Phaser.Rectangle(spriteA.x, spriteA.y, spriteA.width, 50) ;
                    var boundsA2 = new Phaser.Rectangle(spriteA.x+120, spriteA.y, 50, spriteA.height) ;
                    angleBlockA = true;
            }
            else if(spriteB.name == 2) {
                    var boundsB1 = new Phaser.Rectangle(spriteB.x, spriteB.y, spriteB.width, 50) ;
                    var boundsB2 = new Phaser.Rectangle(spriteB.x+120, spriteB.y, 50, spriteB.height) ;
                    angleBlockB = true;
            }
            if(spriteA.name == 5) {
                    var boundsA1 = new Phaser.Rectangle(spriteA.x, spriteA.y+60, spriteA.width, 50) ;
                    var boundsA2 = new Phaser.Rectangle(spriteA.x, spriteA.y, 50, spriteA.height) ;
                    angleBlockA = true;
            }
            else if(spriteB.name == 5) {
                    var boundsB1 = new Phaser.Rectangle(spriteB.x, spriteB.y+60, spriteB.width, 50) ;
                    var boundsB2 = new Phaser.Rectangle(spriteB.x, spriteB.y, 50, spriteB.height) ;
                    angleBlockB = true;
            }

            if(!angleBlockA && !angleBlockB) {
                return Phaser.Rectangle.intersects(boundsA, boundsB);
            }
            else if(angleBlockA && angleBlockB) {
                return ( (Phaser.Rectangle.intersects(boundsA1, boundsB1)) || (Phaser.Rectangle.intersects(boundsA1, boundsB2)) || 
                            (Phaser.Rectangle.intersects(boundsA2, boundsB1)) || (Phaser.Rectangle.intersects(boundsA2, boundsB2)) );
            }
            else if(angleBlockA && !angleBlockB) {
                return ( (Phaser.Rectangle.intersects(boundsA1, boundsB)) || (Phaser.Rectangle.intersects(boundsA2, boundsB)) );
            }
            else if(!angleBlockA && angleBlockB) {
                return ( (Phaser.Rectangle.intersects(boundsA, boundsB1)) || (Phaser.Rectangle.intersects(boundsA, boundsB2)) );
            }
    }

    //----CREATE OBJECTS----\\
    //Create Lines on the edges of 5x5 grid for advance invalid placement check
    function createLine(x1,y1,x2,y2) {
            temp_line = game.add.graphics(0, 0);    
            temp_line.beginFill(0x000000);    
            temp_line.lineStyle(1, 0x000000, 1);    
            temp_line.moveTo(x1, y1);    
            temp_line.lineTo(x2, y2);    
            temp_line.endFill();
            temp_line.alpha = 0.2;
            lines.add(temp_line);
    }
    //Create items/blocks
    function createItem(x,y,name) {
            temp_item = game.add.sprite(x,y,name);
            temp_item.name = name;
            temp_item.validPlace = false;
            temp_item.inputEnabled = true;
            if((temp_item.name == 2)||(temp_item.name == 5)||(temp_item.name == 6)) {
                temp_item.input.enableDrag(false, true, true, 255, null, null);
            }else{
                temp_item.input.enableDrag(false, true, false, 255, null, null);
            }
            temp_item.events.onDragStart.add(dragStart);
            temp_item.events.onDragUpdate.add(dragUpdate);
            temp_item.events.onDragStop.add(dragStop);
            temp_item.input.boundsSprite = blanket;
            items.add(temp_item);
    }

    //----UI BUTTONS----\\
    //btn for reset
    function resetOnClick () {
        items.removeAll();
        createItem(60,150,1);
        createItem(60,320,2);
        createItem(50,450,3);
        createItem(180,180,4);
        createItem(570,340,5);
        createItem(570,150,6);
        createItem(660,210,7);
        createItem(580,480,8);
    }
    //btn for fullscreen
    function fullOnClick() {
        if (game.scale.isFullScreen) {
            game.scale.stopFullScreen();
        }
        else {
            game.scale.startFullScreen(false);
        }
    }

};