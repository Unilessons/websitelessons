/*!
* Start Bootstrap - Stylish Portfolio v6.0.6 (https://startbootstrap.com/theme/stylish-portfolio)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-stylish-portfolio/blob/master/LICENSE)
*/
window.addEventListener('DOMContentLoaded', event => {

    const sidebarWrapper = document.getElementById('sidebar-wrapper');
    let scrollToTopVisible = false;
    // Closes the sidebar menu
    const menuToggle = document.body.querySelector('.menu-toggle');
    menuToggle.addEventListener('click', event => {
        event.preventDefault();
        sidebarWrapper.classList.toggle('active');
        _toggleMenuIcon();
        menuToggle.classList.toggle('active');
    })

    // Closes responsive menu when a scroll trigger link is clicked
    var scrollTriggerList = [].slice.call(document.querySelectorAll('#sidebar-wrapper .js-scroll-trigger'));
    scrollTriggerList.map(scrollTrigger => {
        scrollTrigger.addEventListener('click', () => {
            sidebarWrapper.classList.remove('active');
            menuToggle.classList.remove('active');
            _toggleMenuIcon();
        })
    });

    function _toggleMenuIcon() {
        const menuToggleBars = document.body.querySelector('.menu-toggle > .fa-bars');
        const menuToggleTimes = document.body.querySelector('.menu-toggle > .fa-xmark');
        if (menuToggleBars) {
            menuToggleBars.classList.remove('fa-bars');
            menuToggleBars.classList.add('fa-xmark');
        }
        if (menuToggleTimes) {
            menuToggleTimes.classList.remove('fa-xmark');
            menuToggleTimes.classList.add('fa-bars');
        }
    }

    // Scroll to top button appear
    document.addEventListener('scroll', () => {
        const scrollToTop = document.body.querySelector('.scroll-to-top');
        if (document.documentElement.scrollTop > 100) {
            if (!scrollToTopVisible) {
                fadeIn(scrollToTop);
                scrollToTopVisible = true;
            }
        } else {
            if (scrollToTopVisible) {
                fadeOut(scrollToTop);
                scrollToTopVisible = false;
            }
        }
    })
})

function fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
        if ((el.style.opacity -= .1) < 0) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
};

function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || "block";
    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
};


function handleSelectChange_uni(select) {
    const selectedValue = select.value;

    // Riferimento all'immagine predefinita
    const defaultImage = document.getElementById("default-image");

    if (selectedValue === "default") {
        // Mostra l'immagine predefinita
        defaultImage.style.display = "block";
        // Nascondi tutte le tendine dei corsi
        hideAllDropdowns_uni();
    } else {
        // Nascondi l'immagine predefinita
        defaultImage.style.display = "none";
        // Mostra solo il dropdown selezionato
        toggleDropdown_uni(selectedValue);
    }
}

function hideAllDropdowns_uni() {
    // Nascondi tutte le tendine dei corsi
    var dropdowns = document.getElementsByClassName('faculty-exams');
    for (var i = 0; i < dropdowns.length; i++) {
        dropdowns[i].style.display = "none";
    }
}

function toggleDropdown_uni(dropdownId) {
    // Nascondi tutte le tendine
    hideAllDropdowns_uni();

    // Mostra solo la tendina selezionata
    var dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        dropdown.style.display = "block";
    }
}


function handleSelectChange_school(select) {
    const selectedValue = select.value;

    // Riferimento all'immagine predefinita
    const defaultImage = document.getElementById("default-image");

    if (selectedValue === "default") {
        // Mostra l'immagine predefinita
        defaultImage.style.display = "block";
        // Nascondi tutte le tendine dei corsi
        hideAllDropdowns_school();
    } else {
        // Nascondi l'immagine predefinita
        defaultImage.style.display = "none";
        // Mostra solo il dropdown selezionato
        toggleDropdown_school(selectedValue);
    }
}

function hideAllDropdowns_school() {
    // Nascondi tutte le tendine dei corsi
    var dropdowns = document.getElementsByClassName('faculty-exams');
    for (var i = 0; i < dropdowns.length; i++) {
        dropdowns[i].style.display = "none";
    }
}

function toggleDropdown_school(dropdownId) {
    // Nascondi tutte le tendine
    hideAllDropdowns_school();

    // Mostra solo la tendina selezionata
    var dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        dropdown.style.display = "block";
    }
}

// Mostra il pulsante quando si scrolla
window.onscroll = function() {
    var scrollToNavbar = document.querySelector('.scroll-to-navbar');
    
    // Mostra il pulsante solo se si è scrollato più di 200px
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        scrollToNavbar.style.display = "block";
    } else {
        scrollToNavbar.style.display = "none";
    }
};

