// 导入测试库
import "mocha";
import { expect } from 'chai';
// 导入待测试单元
import DDZRuleMaster from "../src/logic/ddz/DDZRule";
import { m_cbCardData } from "../src/logic/ddz/Constant";
import { EPokerType } from "../src/logic/ddz/DDZPokerType";
import { logPokerType } from "../src/utils/Log";

let rule: DDZRuleMaster;
let getCardType: Function;

describe( "牌型检测", function () {
    // 钩子 测试前
    before( function () {
        rule = new DDZRuleMaster();
        getCardType = rule.getPokerType.bind( rule );
    } );
    describe( "单张 CT_SINGLE", function () {
        let sucExpect = EPokerType.CT_SINGLE;
        let errExpect = EPokerType.CT_ERROR;
        for ( var i = 0; i < m_cbCardData.length; i++ ) {
            ( function ( i ) {
                let cards = [];
                cards.push( m_cbCardData[ i ] );
                checkPokerType( cards, sucExpect );
            } )( i );
        }
        checkPokerType( [ 0x41 ], errExpect );
        checkPokerType( [ 0x42 ], errExpect );
        checkPokerType( [ 0x43 ], errExpect );
        checkPokerType( [ 0x44 ], errExpect );
        checkPokerType( [ 0x4A ], errExpect );
    } );
    describe( " 顺子 CT_SINGLE_LINE", function () {
        let sucExpect = EPokerType.CT_SINGLE_LINE;
        let errExpect = EPokerType.CT_ERROR;
        checkPokerType( [ 0x09, 0x0A, 0x0B, 0x0C, 0x0D ], sucExpect );
        checkPokerType( [ 0x01, 0x0A, 0x0B, 0x0C, 0x0D ], sucExpect );
        checkPokerType( [ 0x01, 0x1A, 0x2B, 0x3C, 0x0D ], sucExpect );

        checkPokerType( [ 0x01, 0x12, 0x33, 0x14, 0x05, 0x06, 0x37, 0x28, 0x09, 0x1A, 0x2B, 0x3C, 0x0D ], errExpect );
        checkPokerType( [ 0x01, 0x02, 0x1A, 0x2B, 0x3C, 0x0D ], errExpect );
        checkPokerType( [ 0x02, 0x03, 0x04 ], errExpect );
        checkPokerType( [ 0x03, 0x04, 0x05 ], errExpect );
        checkPokerType( [ 0x09, 0x0A, 0x0B ], errExpect );
        checkPokerType( [ 0x02, 0x03, 0x04, 0x05 ], errExpect );
        checkPokerType( [ 0x03, 0x04, 0x05, 0x06 ], errExpect );
        checkPokerType( [ 0x02, 0x03, 0x04, 0x05, 0x06 ], errExpect );
        checkPokerType( [ 0x03, 0x03, 0x04, 0x05, 0x06, 0x07 ], errExpect );
        checkPokerType( [ 0x0A, 0x0B, 0x0C, 0x0D, 0x4E ], errExpect );
        checkPokerType( [ 0x05, 0x06, 0x07, 0x08, 0x09, 0x19, 0x29 ], errExpect );
    } );
    // 对子
    describe( "一对CT_DOUBLE", function () {
        let sucExpect = EPokerType.CT_DOUBLE;
        let errExpect = EPokerType.CT_ERROR;
        checkPokerType( [ 0x01, 0x011 ], sucExpect );
        checkPokerType( [ 0x02, 0x12 ], sucExpect );
        checkPokerType( [ 0x24, 0x34 ], sucExpect );

        checkPokerType( [ 0x01, 0x14 ], errExpect );
        checkPokerType( [ 0x4E, 0x4F ], EPokerType.CT_JOKER_BOMB );
    } );
    // 对子飞机
    describe( "对连CT_DOUBLE_LINE", function () {
        let sucExpect = EPokerType.CT_DOUBLE_LINE;
        let errExpect = EPokerType.CT_ERROR;
        checkPokerType( [ 0x13, 0x33, 0x04, 0x24, 0x05, 0x15 ], sucExpect );
        checkPokerType( [ 0x0A, 0x1A, 0x2B, 0x3B, 0x0C, 0x1C ], sucExpect );
        checkPokerType( [ 0x01, 0x11, 0x0A, 0x1A, 0x2B, 0x3B, 0x0C, 0x1C, 0x2D, 0x3D ], sucExpect );
        checkPokerType( [ 0x04, 0x14, 0x05, 0x15, 0x16, 0x26, 0x17, 0x27, 0x08, 0x38 ], sucExpect );
        checkPokerType( [ 0x01, 0x11, 0x13, 0x33, 0x04, 0x24, 0x05, 0x15, 0x06, 0x16, 0x07, 0x17, 0x08, 0x18, 0x09, 0x19, 0x0A, 0x1A, 0x0B, 0x1B, 0x0C, 0x1C, 0x0D, 0x1D ], sucExpect );

        checkPokerType( [ 0x01, 0x11, 0x02, 0x12 ], errExpect );
        checkPokerType( [ 0x02, 0x12, 0x01, 0x11, 0x0D, 0x1D ], errExpect );
        checkPokerType( [ 0x03, 0x13, 0x04, 0x04 ], errExpect );
        checkPokerType( [ 0x01, 0x11, 0x02, 0x12, 0x03, 0x13 ], errExpect );
        checkPokerType( [ 0x02, 0x12, 0x03, 0x13, 0x04, 0x14 ], errExpect );
        checkPokerType( [ 0x03, 0x13, 0x06, 0x16, 0x05, 0x25 ], errExpect );
        checkPokerType( [ 0x0C, 0x1C, 0x0D, 0x1D, 0x4E, 0x4F ], errExpect );
        checkPokerType( [ 0x03, 0x13, 0x23, 0x14, 0x24, 0x34 ], EPokerType.CT_THREE_LINE );
        checkPokerType( [ 0x03, 0x13, 0x23, 0x33 ], EPokerType.CT_BOMB );

    } );

    // 三条类型
    describe( "三条CT_THREE", function () {
        let sucExpect = EPokerType.CT_THREE;
        let errExpect = EPokerType.CT_ERROR;
        checkPokerType( [ 0x03, 0x13, 0x23 ], sucExpect );
        checkPokerType( [ 0x16, 0x26, 0x36 ], sucExpect );
        checkPokerType( [ 0x11, 0x31, 0x01 ], sucExpect );
        checkPokerType( [ 0x23, 0x33, 0x03 ], sucExpect );

        checkPokerType( [ 0x22, 0x32, 0x42 ], errExpect );
        checkPokerType( [ 0x4D, 0x4E, 0x4F ], errExpect );
        checkPokerType( [ 0x0A, 0x0B, 0x0C ], errExpect );
        checkPokerType( [ 0x03, 0x13, 0x23, 0x05 ], EPokerType.CT_THREE_TAKE_ONE );
        checkPokerType( [ 0x03, 0x13, 0x23, 0x05, 0x15 ], EPokerType.CT_THREE_TAKE_TWO );
        checkPokerType( [ 0x03, 0x13, 0x23, 0x05, 0x06 ], errExpect );
        checkPokerType( [ 0x03, 0x13, 0x23, 0x05, 0x15, 0x25 ], errExpect );
    } );
    describe( "三带一CT_THREE_TAKE_ONE", function () {
        let sucExpect = EPokerType.CT_THREE_TAKE_ONE;
        let errExpect = EPokerType.CT_ERROR;
        checkPokerType( [ 0x03, 0x13, 0x23, 0x04 ], sucExpect );
        checkPokerType( [ 0x13, 0x13, 0x23, 0x4E ], sucExpect );
        checkPokerType( [ 0x18, 0x28, 0x28, 0x01 ], sucExpect );

        checkPokerType( [ 0x03, 0x13, 0x23, 0x33 ], EPokerType.CT_BOMB );
        checkPokerType( [ 0x04, 0x14, 0x24, 0x05, 0x15, 0x25, 0x01, 0x02 ], EPokerType.CT_THREE_LINE_TAKE_ONE );
    } )
    describe( "三带二CT_THREE_TAKE_TWO", function () {
        let sucExpect = EPokerType.CT_THREE_TAKE_TWO;
        let errExpect = EPokerType.CT_ERROR;
        checkPokerType( [ 0x03, 0x13, 0x23, 0x04, 0x14 ], sucExpect );
        checkPokerType( [ 0x13, 0x13, 0x23, 0x0A, 0x2A ], sucExpect );
        checkPokerType( [ 0x18, 0x28, 0x28, 0x01, 0x11 ], sucExpect );

        checkPokerType( [ 0x05, 0x15, 0x25, 0x06, 0x16, 0x07, 0x17 ], errExpect );
        checkPokerType( [ 0x03, 0x13, 0x23, 0x04, 0x15 ], errExpect );
        checkPokerType( [ 0x04, 0x14, 0x24, 0x05, 0x15, 0x25, 0x01, 0x02 ], EPokerType.CT_THREE_LINE_TAKE_ONE );

    } );
    describe( "三不带 飞机CT_THREE_LINE", function () {
        let sucExpect = EPokerType.CT_THREE_LINE;
        let errExpect = EPokerType.CT_ERROR;
        checkPokerType( [ 0x05, 0x06, 0x07, 0x08, 0x09, 0x19, 0x29 ], errExpect );
        checkPokerType( [ 0x05, 0x15, 0x25, 0x06, 0x16, 0x26 ], sucExpect );
        checkPokerType( [ 0x01, 0x11, 0x21, 0x0D, 0x1D, 0x2D ], sucExpect );
        checkPokerType( [ 0x05, 0x15, 0x25, 0x16, 0x26, 0x36, 0x07, 0x17, 0x37 ], sucExpect );
        checkPokerType( [ 0x05, 0x15, 0x25, 0x16, 0x26, 0x36, 0x07, 0x17, 0x37, 0x08, 0x18, 0x28 ], sucExpect );

        checkPokerType( [ 0x01, 0x11, 0x21, 0x02, 0x12, 0x32 ], errExpect );
        checkPokerType( [ 0x02, 0x12, 0x22, 0x03, 0x13, 0x33 ], errExpect );
        checkPokerType( [ 0x04, 0x14, 0x24, 0x06, 0x16, 0x36 ], errExpect );
        checkPokerType( [ 0x05, 0x15, 0x25, 0x06, 0x16, 0x07 ], errExpect );

    } );

    describe( "三带一 飞机 CT_THREE_LINE_TAKE_ONE", function () {
        let sucExpect = EPokerType.CT_THREE_LINE_TAKE_ONE;
        let errExpect = EPokerType.CT_ERROR;
        checkPokerType( [ 0x05, 0x15, 0x25, 0x06, 0x16, 0x26, 0x07, 0x17 ], sucExpect );
        checkPokerType( [ 0x01, 0x11, 0x21, 0x0D, 0x1D, 0x2D, 0x03, 0x02 ], sucExpect );
        checkPokerType( [ 0x05, 0x15, 0x25, 0x16, 0x26, 0x36, 0x07, 0x17, 0x37, 0x11, 0x12, 0x13 ], sucExpect );
        checkPokerType( [ 0x05, 0x15, 0x25, 0x16, 0x26, 0x36, 0x07, 0x17, 0x37, 0x08, 0x18, 0x28, 0x01, 0x11, 0x21, 0x31 ], sucExpect );

        checkPokerType( [ 0x05, 0x15, 0x25, 0x16, 0x26, 0x36, 0x07, 0x017, 0x37, 0x01, 0x11, 0x21 ], errExpect );
        checkPokerType( [ 0x01, 0x11, 0x21, 0x02, 0x12, 0x32, 0x31, 0x22 ], EPokerType.CT_FOUR_TAKE_TWO);
        checkPokerType( [ 0x02, 0x12, 0x22, 0x03, 0x13, 0x33, 0x01, 0x02 ], errExpect );
        checkPokerType( [ 0x04, 0x14, 0x24, 0x06, 0x16, 0x36, 0x01, 0x02 ], errExpect );
        checkPokerType( [ 0x05, 0x15, 0x25, 0x06, 0x16, 0x07, 0x17 ], errExpect );

    } );

    describe( "三带二 飞机 CT_THREE_LINE_TAKE_TWO", function () {
        let sucExpect = EPokerType.CT_THREE_LINE_TAKE_TWO;
        let errExpect = EPokerType.CT_ERROR;
        checkPokerType( [ 0x01, 0x11, 0x21, 0x0D, 0x1D, 0x2D, 0x03, 0x13, 0x24, 0x34 ], sucExpect );
        checkPokerType( [ 0x05, 0x15, 0x25, 0x16, 0x26, 0x36, 0x07, 0x17, 0x37, 0x27 ], sucExpect );
        checkPokerType( [ 0x05, 0x15, 0x25, 0x16, 0x26, 0x36, 0x07, 0x17, 0x37, 0x08, 0x18, 0x28, 0x38, 0x0A, 0x1A ], sucExpect );

        checkPokerType( [ 0x05, 0x15, 0x25, 0x06, 0x16, 0x26, 0x01, 0x11, 0x12, 0x23 ], errExpect );
        checkPokerType( [ 0x01, 0x11, 0x21, 0x02, 0x12, 0x32, 0x05, 0x15, 0x06, 0x07, 0x08, 0x09 ], errExpect );
        checkPokerType( [ 0x01, 0x11, 0x21, 0x02, 0x12, 0x32, 0x05, 0x15, 0x04, 0x14 ], errExpect );
        checkPokerType( [ 0x02, 0x12, 0x22, 0x03, 0x13, 0x33, 0x11, 0x12, 0x05, 0x15 ], errExpect );
        checkPokerType( [ 0x02, 0x12, 0x22, 0x03, 0x13, 0x33, 0x11, 0x12, 0x05, 0x16 ], errExpect );
        // checkPokerType( [ 0x04, 0x14, 0x24, 0x06, 0x16, 0x36, 0x01, 0x02 ], errExpect );
        // checkPokerType( [ 0x05, 0x15, 0x25, 0x06, 0x16, 0x07, 0x17 ], errExpect );
    } );

    describe( "炸弹类型CT_BOMB", function () {
        let sucExpect = EPokerType.CT_BOMB;
        let errExpect = EPokerType.CT_ERROR;
        checkPokerType( [ 0x01, 0x11, 0x21, 0x31 ], sucExpect );
        checkPokerType( [ 0x0A, 0x1A, 0x2A, 0x3A ], sucExpect );

        checkPokerType( [ 0x01, 0x21, 0x31, 0x02 ], EPokerType.CT_THREE_TAKE_ONE );
        checkPokerType( [ 0x01, 0x21, 0x31, 0x11, 0x04 ], errExpect );
        checkPokerType( [ 0x04, 0x14, 0x24, 0x34, 0x03, 0x13, 0x23, 0x33 ], EPokerType.CT_FOUR_TAKE_TWO );
    } );

    describe( "四带两单CT_FOUR_TAKE_ONE", function () {
        let sucExpect = EPokerType.CT_FOUR_TAKE_ONE;
        let errExpect = EPokerType.CT_ERROR;
        checkPokerType( [ 0x02, 0x12, 0x22, 0x32, 0x01, 0x07 ], sucExpect );
        checkPokerType( [ 0x03, 0x13, 0x23, 0x33, 0x01, 0x11 ], sucExpect );
        checkPokerType( [ 0x04, 0x14, 0x24, 0x34, 0x4E, 0x4F ], sucExpect );

        checkPokerType( [ 0x04, 0x14, 0x24, 0x34, 0x03, 0x13, 0x23, 0x33, 0x05, 0x15 ], errExpect );
        checkPokerType( [ 0x08, 0x18, 0x28, 0x38, 0x05, 0x06, 0x07 ], errExpect );
    } );

    describe( "四带两对CT_FOUR_TAKE_TWO", function () {
        let sucExpect = EPokerType.CT_FOUR_TAKE_TWO;
        let errExpect = EPokerType.CT_ERROR;
        checkPokerType( [ 0x02, 0x12, 0x22, 0x32, 0x01, 0x11, 0x03, 0x13 ], sucExpect );
        checkPokerType( [ 0x03, 0x13, 0x23, 0x33, 0x01, 0x11, 0x0A, 0x1A ], sucExpect );
        checkPokerType( [ 0x04, 0x14, 0x24, 0x34, 0x03, 0x13, 0x23, 0x33 ], sucExpect );

        checkPokerType( [ 0x08, 0x18, 0x28, 0x38, 0x15, 0x25, 0x06, 0x17 ], errExpect );
    } );

    describe( "火箭类型CT_MISSILE_CARD", function () {
        let sucExpect = EPokerType.CT_JOKER_BOMB;
        let errExpect = EPokerType.CT_ERROR;
        checkPokerType( [ 0x4E, 0x4F ], sucExpect );

        checkPokerType( [ 0x3E, 0x4F ], errExpect );
        // checkPokerType( [ 0x01, 0x11 ], errExpect );
        checkPokerType( [ 0x01, 0x02 ], errExpect );
    } );

} );

function checkPokerType( cards: number[], sucExpect: any ) {
    let log = `牌值:[${ cards.join( "," ) }]，牌型:${ logPokerType( sucExpect ) }`;
    let errorLog = `牌型应该为:`;
    it( log, function () {
        let type = getCardType( cards );
        expect( type, errorLog + logPokerType( type ) ).equal( sucExpect )
    } );
}

// 跟牌与被跟牌的设置测试用例
function checkFollowTest( toFollow, follow, bollean ) {
    var log = "待跟牌： ";
    log += '[' + toFollow.join( "," ) + "] , 我跟的牌是： " + "[" + follow.join( "," ) + "] , 期望值是 ： " + bollean;
    var error = "你不能这样去跟牌的！";

}
