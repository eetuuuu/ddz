// 游戏玩家数量
export const GAME_PLAYER = 3;
// 最大同值扑克数
export const MAX_POKER_COUNT = 4;
// 地主初始牌张数
export const MAX_COUNT = 20;
// 总牌数
export const FULL_COUNT = 54;
// 单人初始牌张数
export const NORMAL_COUNT = 17;

//扑克数据
export const m_cbCardData: number[] =
    [
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D,	//方块 3 - 2
        0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D,	//梅花 3 - 2
        0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D,   //红桃 3 - 2
        0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D,	//黑桃 3 - 2
        0x4E, 0x4F                                                                      // 大小王
    ];
// 小王
export const SJOKER = 0x4E;
// 大王
export const LJOKER = 0x4F;

// 排序类型
export enum SORT_TYPE {
    ST_COUNT = 1,               // 数目排序
    ST_LOGIC = 2,               // 逻辑优先
    ST_PATTERN = 3,             // 花色优先
}