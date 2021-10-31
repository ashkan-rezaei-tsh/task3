var firstUser = [
    {
        id: 1,
        username: "admin",
        firstName: "اشکان",
        lastName: "رضایی",
        nationalCode: "0015482261",
        birthDate: "1371/07/12",
        city: "شیراز",
        mobile: "09379069256",
        address: "میانرود",
        role: "admin",
        password: "admin",
        images: {
            file1: null,
            file2: null,
            file3: null,
            file4: null,
        },
    },
];

if (!document.querySelector("#login-page") && (localStorage.getItem("isLoggedIn") === null || localStorage.getItem("isLoggedIn") == 0)) {
    localStorage.setItem("isLoggedIn", 0);
    location.href = "login.html";
}

if (localStorage.getItem("users") === null) {
    localStorage.setItem("users", JSON.stringify(firstUser));
}

if (localStorage.getItem("latestId") === null) {
    localStorage.setItem("latestId", 1);
}

function logout() {
    localStorage.setItem("isLoggedIn", 0);
    location.href = "login.html";
}

let users = JSON.parse(localStorage.getItem("users") || "[]");

const loginForm = document.getElementById("login");

loginForm &&
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = loginForm.querySelector("#username");
        const password = loginForm.querySelector("#password");

        resetFormErrors();

        const userIndex = users.findIndex((user) => user.username.toLowerCase().trim() == username.value.toLowerCase().trim());

        if (userIndex > -1 && password.value.toLowerCase() === users[userIndex].password) {
            location.href = "users-list.html";
            localStorage.setItem("isLoggedIn", 1);
        } else {
            showFormError(username, "نام کاربری یا رمز عبور اشتباه است.");
        }
    });

const showFormError = (invalidField, error) => {
    invalidField.classList.add("invalid");
    invalidField.nextElementSibling.textContent = error;
};

const resetFormErrors = () => {
    document.querySelectorAll(".error-text").forEach((elem, index) => {
        elem.textContent = "";
    });

    document.querySelectorAll("input").forEach((elem, index) => {
        elem.classList.remove("invalid");
    });
};

const usersList = document.querySelector("#users-list");

let template = "";

users.forEach((user) => {
    template += `
    <tr id="user_${user.id}">
        <td>${user.username}</td>
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${user.nationalCode}</td>
        <td>${user.birthDate}</td>
        <td>${user.city}</td>
        <td>${user.mobile}</td>
        <td>${user.address}</td>
        <td>${user.role === "admin" ? "مدیر" : "کاربر"}</td>
        <td>
            <a href="edit-user.html?id=${user.id}" class="btn btn-info" title="ویرایش">
                <img src="assets/img/edit.png" alt="" />
            </a>
            <button type="button" class="btn btn-danger" title="حذف" onclick="deleteUser(${user.id})">
                <img src="assets/img/delete.png" alt="" />
            </button>
             <button type="button" class="btn btn-warning" title="تغییر رمز" onclick="changePasswordModal(${user.id})">
                <img src="assets/img/password.png" alt="" />
            </button>
            <a href="user-documents.html?id=${user.id}" class="btn btn-success" title="افزودن عکس">
                <img src="assets/img/images.png" alt="" />
            </a>
        </td>
    </tr>
    `;
});

const changePasswordModal = (userId) => {
    const id = users.findIndex((user) => user.id == userId);

    document.querySelector("#id").value = id;
    const modalEl = document.querySelector("#changePasswordModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
    modalEl.addEventListener("shown.bs.modal", function () {
        document.querySelector("#password").focus();
    });
};

const changePassword = () => {
    const password = document.querySelector("#password");
    const confirmPass = document.querySelector("#confirmPassword");
    const error = document.querySelector(".error-text");

    const id = document.querySelector("#id").value;

    error.textContent = "";
    password.classList.remove("invalid");
    confirmPass.classList.remove("invalid");

    if (password.value !== "" && password.value === confirmPass.value) {
        users[id].password = password.value;
        localStorage.setItem("users", JSON.stringify(users));
        password.value = "";
        confirmPass.value = "";
        const modalEl = document.querySelector("#changePasswordModal");
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
    } else {
        password.classList.add("invalid");
        confirmPass.classList.add("invalid");
        error.textContent = "رمز عبور با تکرار رمز عبور یکسان نمی باشد";
    }
};

const updateDeletedUserUI = (id) => {
    document.querySelector("#user_" + id).remove();
};

function deleteUser(id) {
    Swal.fire({
        title: "آیا از حذف کاربر اطمینان دارید؟",
        text: "این عمل غیر قابل بازگشت است.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e94631",
        cancelButtonColor: "#b0b0b0",
        confirmButtonText: "حذف",
        cancelButtonText: "انصراف",
    }).then((result) => {
        if (result.isConfirmed) {
            let index = users.findIndex((user) => {
                return user.id == id;
            });

            if (index > -1) {
                users.splice(index, 1);

                localStorage.setItem("users", JSON.stringify(users));
                Swal.fire("حذف شد!", "کاربر مورد نظر حذف شد.", "success");

                updateDeletedUserUI(id);
            } else {
                Swal.fire("خطا!", "کاربر مورد نظر پیدا نشد!", "error");
            }
        }
    });
}

usersList && usersList.querySelector("tbody").insertAdjacentHTML("beforeend", template);
// usersList.querySelector("tbody").innerHTML += template;

const newId = () => {
    const latestId = +localStorage.getItem("latestId");
    localStorage.setItem("latestId", latestId + 1);
    return latestId + 1;
};

users = JSON.parse(localStorage.getItem("users") || "[]");

const addUserForm = document.querySelector("#add-user-form");

addUserForm &&
    addUserForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const password = document.getElementById("password");
        const confirmPassword = document.getElementById("confirm-password");
        const passwordError = document.querySelector(".error-text");

        password.classList.remove("invalid");
        confirmPassword.classList.remove("invalid");
        passwordError.textContent = "";

        if (password.value.trim() !== "" && password.value === confirmPassword.value) {
            const username = document.getElementById("username").value;
            const fname = document.getElementById("firstname").value;
            const lname = document.getElementById("lastname").value;
            const nationalCode = document.getElementById("nationalCode").value;
            const birthDate = document.getElementById("birthDate").value;
            const city = document.getElementById("city").value;
            const mobile = document.getElementById("mobile").value;
            const address = document.getElementById("address").value;
            const role = document.getElementById("role").value;
            const password = document.getElementById("password").value;

            users.push({
                id: newId(),
                username,
                firstName: fname,
                lastName: lname,
                nationalCode,
                birthDate,
                city,
                mobile,
                address,
                role,
                password,
            });

            localStorage.setItem("users", JSON.stringify(users));

            location.href = "users-list.html";
        } else {
            password.classList.add("invalid");
            confirmPassword.classList.add("invalid");
            passwordError.textContent = "رمز و تکرار آن با هم تفاوت دارد.";
        }
    });

/**Edit User Page */
const href = location.href;
let id = -1;
if (href.indexOf("?id=") >= 0) {
    id = href.split("id=").pop();
}

if (id >= 0) {
    const userIndex = users.findIndex((user) => user.id == id);
    const user = users[userIndex];

    for (const elem in user) {
        if (document.querySelector("#" + elem)) {
            document.querySelector("#" + elem).value = user[elem];
        }
    }
}

const editUserForm = document.querySelector("#edit-user-form");

editUserForm &&
    editUserForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const userId = editUserForm.querySelector("#id").value;

        let id = users.findIndex((user) => user.id == userId);

        let editedUser = {
            id: userId,
            firstName: editUserForm.querySelector("#firstName").value,
            lastName: editUserForm.querySelector("#lastName").value,
            nationalCode: editUserForm.querySelector("#nationalCode").value,
            birthDate: editUserForm.querySelector("#birthDate").value,
            mobile: editUserForm.querySelector("#mobile").value,
            city: editUserForm.querySelector("#city").value,
            address: editUserForm.querySelector("#address").value,
            username: editUserForm.querySelector("#username").value,
            role: editUserForm.querySelector("#role").value,
            password: users[id].password,
        };

        users[id] = editedUser;
        localStorage.setItem("users", JSON.stringify(users));
        location.href = "users-list.html";
    });

const userDocumentsPage = document.getElementById("user-documents");

if (userDocumentsPage) {
    const userId = location.href.split("id=").pop();

    const id = users.findIndex((user) => user.id == userId);

    if (id < 0 || users[id].images.file1 == null) {
        document.querySelectorAll('input[type="file"]').forEach((input) => {
            input.addEventListener("change", (event) => {
                viewSelectedImage(event);
            });
        });
    } else {
        let i = 1;
        document.querySelectorAll(".user-images-wrapper img").forEach((img) => {
            const parent = img.closest("label");
            parent.classList.add("filled");

            img.setAttribute("src", users[id].images[`file${i}`]);
            i++;
        });
    }
}

function viewSelectedImage(event) {
    const parent = event.target.closest("label");
    const img = event.target.previousElementSibling;

    let reader = new FileReader();

    reader.onload = (e) => {
        img.setAttribute("src", e.target.result);
        parent.classList.add("filled");
    };

    reader.readAsDataURL(event.target.files[0]);
}

const saveUserImages = () => {
    const userId = location.href.split("id=").pop();

    const id = users.findIndex((user) => {
        return user.id == userId;
    });

    for (let i = 1; i <= 4; i++) {
        users[id].images[`file${i}`] = document.querySelector("#user-image__" + i).getAttribute("src");
    }

    localStorage.setItem("users", JSON.stringify(users));

    location.href = "users-list.html";
};
