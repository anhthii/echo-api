const fetch = require('node-fetch')

const customFetch = (url, headers = {}) => {
    return fetch(url, {
        headers: {
            ...headers,
            Cookie: "zmp3_userid_random=761197406; zmp3_app_version_lagecy=v0.2.12; ZMP3_VERSION=V5; visitorId=3000.SSZzejyD0jSbZUgxWaGPoJIFlgNCIW6AQ9sqkju84vnutElytWvSs7dUwl3PHLxPT9Ngzz17MD8sD3S.1; _zlang=vn; zpsid=eMqpTcwdFagwSouRJPj5LjqKIGrCcKHQsWr825R5CIJ27ceh1DOpEivQP0mrk7SvsceVBJEs66EyVdDtIwW9Nh1nOLjGdZTGY45VPM6Y1aomV49bThGRTm; zpsidleg=eMqpTcwdFagwSouRJPj5LjqKIGrCcKHQsWr825R5CIJ27ceh1DOpEivQP0mrk7SvsceVBJEs66EyVdDtIwW9Nh1nOLjGdZTGY45VPM6Y1aomV49bThGRTm; zmp3_sid=ovogHQObK7BTdQX4gY99SzY7z37KEbfH-zNdCyes7b_Sv8btoI8k9FtYXnYJH3f8fvgP2Qv8DLgBWQyte705PBMmamQyI3XvjQU56uS2C7Eqkg05QMG; session_key=ovogHQObK7BTdQX4gY99SzY7z37KEbfH-zNdCyes7b_Sv8btoI8k9FtYXnYJH3f8fvgP2Qv8DLgBWQyte705PBMmamQyI3XvjQU56uS2C7Eqkg05QMG; ZMP3_THEME=dark; __zi=3000.SSZzejyD0jSbZUgxWaGPoJIFlgNCIW6AQ9sqkju84vn-tklys0nSs7_Swl3VHrxPSfVgzzP5MD8sD3S.1; fpsend=148867; zmp3_rqid_lagecy=MHwxMTMdUngMTmUsICzLjEwNi44OHx2MC4yLjEyfDE2MDmUsIC3NjmUsICzNTY4OTI",
        }
    })
}

module.exports = customFetch