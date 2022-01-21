/**
 * 框架默认数据
 * 使用框架时需要对这些数据进行修改
 * 注意资源名不要重复
 */

let ResConstValue: {
    /**
    * 子包名数组，可添加多个
    * 注意：
    * loading场景中的资源和脚本不能加入分包之中，否则loading场景无法加载成功
    */
    PACKAGES_NAME: string[],

    /**
     * 本地资源路径列表
     ***本地资源路径结构***
     *resource文件夹下的路径
     * {
     *   resName:string,
     *   resLocalPath:string
     * }
     */
    LocalResList: {
        resName: string,
        resLocalPath: string,
    }[],

    /**
     * 服务器中远程资源路径列表
     * ***远程资源路径结构***
     * 服务器上远程资源路径
     * {
     *   resName:string,
     *   remoteResPath:string,
     * }
     */
    remoteResList: {
        resName: string,
        remoteResPath: string,
    }[],

    /**
     * 腾讯云服务器中远程资源路径列表
     * ***腾讯云服务器中的资源路径结构*
     * {
     *    resName: string,
     *    tCloudResPath: string,
     * }
     * 使用该功能需要开通云服务，直接在cocos面板开通使用即可
     * 在网页后台直接上传文件或者文件夹即可，或者使用腾讯云官方提供的工具
     * 记录下fileid即是这里的tCloudResPath
     */
    tCloudResList: {
        resName: string,
        tCloudResPath: string,
    }[]
} = {
    PACKAGES_NAME: [
    ],
    LocalResList: [
    ],
    remoteResList: [],
    tCloudResList: [
        {
            resName:'swiper1',
            tCloudResPath:'cloud://test-1g6fmcaqc00fb341.7465-test-1g6fmcaqc00fb341-1305067680/picture/swiper1.jpg'
        },
        {
            resName:'swiper2',
            tCloudResPath:'cloud://test-1g6fmcaqc00fb341.7465-test-1g6fmcaqc00fb341-1305067680/picture/swiper2.jpg'
        },
        {
            resName:'swiper3',
            tCloudResPath:'cloud://test-1g6fmcaqc00fb341.7465-test-1g6fmcaqc00fb341-1305067680/picture/swiper3.jpg'
        },
        {
            resName:'spineAtlas',
            tCloudResPath:'cloud://test-1g6fmcaqc00fb341.7465-test-1g6fmcaqc00fb341-1305067680/spine/luxiaoqi.atlas'
        },
        {
            resName:'spineJSON',
            tCloudResPath:'cloud://test-1g6fmcaqc00fb341.7465-test-1g6fmcaqc00fb341-1305067680/spine/luxiaoqi.json'
        },
        {
            resName:'spinePicture',
            tCloudResPath:'cloud://test-1g6fmcaqc00fb341.7465-test-1g6fmcaqc00fb341-1305067680/spine/luxiaoqi.png'
        },
        {
            resName:'beimianAtlas',
            tCloudResPath:'cloud://test-1g6fmcaqc00fb341.7465-test-1g6fmcaqc00fb341-1305067680/spine/beimian.atlas'
        },
        {
            resName:'beimianJSON',
            tCloudResPath:'cloud://test-1g6fmcaqc00fb341.7465-test-1g6fmcaqc00fb341-1305067680/spine/beimian.json'
        },
        {
            resName:'beimianPicture',
            tCloudResPath:'cloud://test-1g6fmcaqc00fb341.7465-test-1g6fmcaqc00fb341-1305067680/spine/beimian.png'
        },
        {
            resName:'clickMusic',
            tCloudResPath:'cloud://test-1g6fmcaqc00fb341.7465-test-1g6fmcaqc00fb341-1305067680/music/clickBubble.mp3'
        }
    ]
};

export default ResConstValue;