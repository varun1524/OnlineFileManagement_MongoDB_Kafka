const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3001';

const headers = {
    'Accept': 'application/json'
};

export const doSignUp = (payload) =>
    fetch (`${api}/signup/doSignUp`,
        {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(res => {
        return res.status;
    }).catch(error => {
        console.log("Error: "+error);
        return error;
    });

export const doLogin = (payload) =>
    fetch(`${api}/login/doLogin`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => {
        return res.status;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const getSession = () =>
    fetch(`${api}/login/getSession`, {
        method: 'GET',
        credentials:'include'
    }).then(res => {
        return res;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const doLogout = (payload) =>
    fetch(`${api}/login/doLogout`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => {
        return res.status;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const getDirectoryData = (payload) =>
    fetch(`${api}/users/getDirData`,{
        method:'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => {return res;})
        .catch(error => {
            console.log("This is error.");
            return error;
        });

//Sending byte Array
export const uploadFile = (payload) =>
    fetch(`${api}/users/upload`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials:'include'
    }).then(res => {
        return res.status;
    }).catch(error => {
        console.log("This is error");
        return error;
    });

export const uploadFileInGroup = (payload) =>
    fetch(`${api}/group/upload`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials:'include'
    }).then(res => {
        return res;
    }).catch(error => {
        console.log("This is error");
        return error;
    });


export const addMembersInGroup = (payload) =>
    fetch(`${api}/group/addmember`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials:'include'
    }).then(res => {
        return res;
    }).catch(error => {
        console.log("This is error");
        return error;
    });

//Sending byte Array
export const downloadFile = (payload) =>
    fetch(`${api}/users/downloadfile`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials:'include'
    }).then(res => {
        return res;
    }).catch(error => {
        console.log("This is error");
        return error;
    });

/*export const uploadFile = (payload) =>
    fetch(`${api}/users/upload`, {
        method: 'POST',
        body: payload,
        credentials:'include'
    }).then(res => {
        return res.status;
    }).catch(error => {
        console.log("This is error");
        return error;
    });*/

export const createDirectory = (payload) =>
    fetch(`${api}/users/createDir`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(payload),
        credentials:'include'
    }).then(res => {
        return res;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });


export const sendDirectorayPath = (payload) =>
    fetch(`${api}/users/setdirPath`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(payload),
        credentials:'include'
    }).then(res => {
        return res;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const doShareData = (payload) =>
    fetch (`${api}/users/share`,
        {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        }).then(res => {
        return res;
    }).catch(error => {
        console.log("Error: " + error);
        return error;
    });

export const doRemoveSharing = (payload) =>
    fetch (`${api}/users/removesharing`,
        {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        }).then(res => {
        return res;
    }).catch(error => {
        console.log("Error: " + error);
        return error;
    });

export const changeStarredStatus = (payload) =>
    fetch (`${api}/users/changestarredstatus`,
        {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        }).then(res => {
        return res;
    }).catch(error => {
        console.log("Error: " + error);
        return error;
    });

export const fetchStarredData = (payload) =>
    fetch (`${api}/users/getStarredData`,
        {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        }).then(res => {
        return res;
    }).catch(error => {
        console.log("Error: " + error);
        return error;
    });

export const fetchDataSharedByUser = (payload) =>
    fetch (`${api}/users/getDataSharedByUser`,
        {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        }).then(res => {
        return res;
    }).catch(error => {
        console.log("Error: " + error);
        return error;
    });


export const fetchDataSharedWithUser = (payload) =>
    fetch (`${api}/users/fetchDataSharedWithUser`,
        {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        }).then(res => {
        return res;
    }).catch(error => {
        console.log("Error: " + error);
        return error;
    });

export const accessSharedData = (payload) =>
    fetch (`${api}/users/accessSharedData`,
        {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        }).then(res => {
        return res;
    }).catch(error => {
        console.log("Error: " + error);
        return error;
    });

export const updateProfile = (payload) =>
    fetch (`${api}/users/updateProfile`,
        {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        }).then(res => {
        return res;
    }).catch(error => {
        console.log("Error: " + error);
        return error;
    });

export const getprofile = () =>
    fetch (`${api}/users/getprofile`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include'
    }).then(res => {
        return res;
    }).catch(error => {
            console.log("This is error");
            return error;
    });

export const createGroup = (payload) =>
    fetch(`${api}/group/creategroup`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(payload),
        credentials:'include'
    }).then(res => {
        return res;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const getGroups = () =>
    fetch (`${api}/group/getgroups`,
        {
            method: 'POST',
            credentials: 'include'
        }).then(res => {
        return res;
    }).catch(error => {
        console.log("Error: " + error);
        return error;
    });

export const getGroupData = (payload) =>
    fetch(`${api}/group/getgroupdata`,{
        method:'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => {return res;})
        .catch(error => {
            console.log("This is error.");
            return error;
        });

export const createDirectoryInGroup = (payload) =>
    fetch(`${api}/group/createDir`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(payload),
        credentials:'include'
    }).then(res => {
        return res;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const fetchGroupAccessDetails = (payload) =>
    fetch(`${api}/group/fetchgroupaccessdetails`,{
        method:'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => {return res;})
        .catch(error => {
            console.log("This is error.");
            return error;
        });


export const getGroupMembers = (payload) =>
    fetch(`${api}/group/getgroupmembers`,{
        method:'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => {return res;})
        .catch(error => {
            console.log("This is error.");
            return error;
        });

export const getActivityData = () =>
    fetch (`${api}/users/getActivityData`,
        {
            method: 'POST',
            credentials: 'include'
        }).then(res => {
        return res;
    }).catch(error => {
        console.log("Error: " + error);
        return error;
    });

export const deleteContent = (payload) =>
    fetch (`${api}/users/deleteContent`,
        {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        }).then(res => {
        return res;
    }).catch(error => {
        console.log("Error: " + error);
        return error;
    });

export const deleteGroup = (payload) =>
    fetch (`${api}/group/deletegroup`,
        {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        }).then(res => {
        return res;
    }).catch(error => {
        console.log("Error: " + error);
        return error;
    });

export const deleteMember = (payload) =>
    fetch (`${api}/group/deletemember`,
        {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        }).then(res => {
        return res;
    }).catch(error => {
        console.log("Error: " + error);
        return error;
    });

export const deletecontentfromgroup = (payload) =>
    fetch (`${api}/group/deletecontent`,
        {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        }).then(res => {
        return res;
    }).catch(error => {
        console.log("Error: " + error);
        return error;
    });
// export const fetchSelectedDataSharedWithUser = (payload) =>
//     fetch (`${api}/users/accessSelectedSharedData`,
//         {
//             method: 'POST',
//             headers: {
//                 ...headers,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(payload),
//             credentials: 'include'
//         }).then(res => {
//         return res;
//     }).catch(error => {
//         console.log("Error: " + error);
//         return error;
//     });



// export const getStarredDirectoryData =

/*
export const doCalculate = (payload) =>
    fetch (`${api}/users/doCalculate`,
        {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(res => {
        return res.json();
    }).catch(error => {
        console.log("Error: "+error);
        return error;
    });*/
