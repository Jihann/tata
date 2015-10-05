/**
 * Created by Jihann on 2015/9/28.
 */
var board = [];
var score = 0; //分数

jQuery(function() {
   newgame();
});

function newgame() {
    //初始化棋盘格
    init();
    //随机在两个格子中生成数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = jQuery("#grid-cell-" + i + "-" + j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }
    }

    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
        }
    }

    updateBoardView();
}

function updateBoardView() {
    jQuery(".number-cell").remove();
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){
            jQuery("#grid-container").append( '<div class="number-cell" id="number-cell-' + i + '-' + j +'"></div>' );
            var theNumberCell = jQuery('#number-cell-' + i + '-' + j);
            if( board[i][j] == 0 ){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i, j) + 50);
                theNumberCell.css('left',getPosLeft(i, j) + 50);
            } else {
                theNumberCell.css('width','100px');
                theNumberCell.css('height','100px');
                theNumberCell.css('top',getPosTop(i, j));
                theNumberCell.css('left',getPosLeft(i, j));
                theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j]));
                theNumberCell.css('color',getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
        }
}

function generateOneNumber(){

    if( nospace( board ) )
        return false;

    var randx = parseInt( Math.floor( Math.random()  * 4 ) );
    var randy = parseInt( Math.floor( Math.random()  * 4 ) );

    var times = 0;
    while( times < 50 ){
        if( board[randx][randy] == 0 )
            break;

        randx = parseInt( Math.floor( Math.random()  * 4 ) );
        randy = parseInt( Math.floor( Math.random()  * 4 ) );

        times ++;
    }
    if( times == 50 ){
        for( var i = 0 ; i < 4 ; i ++ )
            for( var j = 0 ; j < 4 ; j ++ ){
                if( board[i][j] == 0 ){
                    randx = i;
                    randy = j;
                }
            }
    }

    var randNumber = Math.random() < 0.5 ? 2 : 4;

    board[randx][randy] = randNumber;
    showNumberWithAnimation( randx , randy , randNumber );

    return true;
}