anime.defaults.easing = 'easeOutExpo';
anime.defaults.duration = 750;

const inputAnimation = {
    init: () => {
        const input = document.getElementById('userInput');
        
        input.addEventListener('focus', () => {
            anime({
                targets: input,
                scale: [1, 1.02],
                duration: 300,
                easing: 'easeOutElastic'
            });
        });
        
        input.addEventListener('blur', () => {
            anime({
                targets: input,
                scale: [1.02, 1],
                duration: 300,
                easing: 'easeOutElastic'
            });
        });
    }
};

const buttonAnimation = {
    init: () => {
        const button = document.getElementById('sendButton');
        
        button.addEventListener('mouseenter', () => {
            anime({
                targets: button,
                scale: 1.1,
                duration: 300
            });
        });
        
        button.addEventListener('mouseleave', () => {
            anime({
                targets: button,
                scale: 1,
                duration: 300
            });
        });
    }
};

const scoreAnimation = {
    update: (element) => {
        anime({
            targets: element,
            scale: [1.2, 1],
            duration: 300,
            easing: 'easeOutBounce'
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    inputAnimation.init();
    buttonAnimation.init();
});