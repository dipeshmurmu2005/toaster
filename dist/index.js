import { Icons } from "./icons.js";
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const defaultOptions = {
    containerId: 'itstoaster-container',
    stackSize: 3,
};
export class Toaster {
    constructor(options = {}) {
        this.options = Object.assign(Object.assign({}, defaultOptions), options);
        this.container = null;
        this.stackSize = this.options.stackSize;
        this.containerId = this.options.containerId;
        this.iconFinder = new Icons();
        this.positions = ['top-left', 'top-center', 'top-right'];
        this.createNotificationSection(this.containerId);
        this.attachListeners();
    }
    createNotificationSection(containerId) {
        var itstoasterContainer = document.createElement('div');
        itstoasterContainer.setAttribute('id', containerId);
        this.positions.forEach(position => {
            var toastStack = document.createElement('div');
            toastStack.setAttribute('class', `toast-stack ${position}`);
            toastStack.setAttribute('position', position);
            itstoasterContainer.appendChild(toastStack);
        });
        document.body.appendChild(itstoasterContainer);
    }
    success(info = {}) {
        const defaultInfo = {
            position: 'top-right',
            dismissable: false,
            title: 'Boom. Nailed it',
            description: 'You just leveled up your workflow.',
            duration: 3000,
            showProgress: true,
            icon: {
                name: 'check_circle',
                size: 30,
                color: undefined,
            },
        };
        const finalInfo = Object.assign(Object.assign(Object.assign({}, defaultInfo), info), { icon: Object.assign(Object.assign({}, defaultInfo.icon), info.icon) });
        if (this.positions.find((position) => position == finalInfo.position)) {
            this.createToast(finalInfo);
        }
    }
    warning(info = {}) {
        const defaultInfo = {
            position: 'top-right',
            dismissable: false,
            title: "Warning Issued",
            description: 'It’s not broken, but it’s definitely twitchy.',
            duration: 3000,
            showProgress: true,
            icon: {
                name: 'exclamation_circle',
                size: 30,
                color: undefined,
            },
        };
        const finalInfo = Object.assign(Object.assign(Object.assign({}, defaultInfo), info), { icon: Object.assign(Object.assign({}, defaultInfo.icon), info.icon) });
        if (this.positions.find((position) => position == finalInfo.position)) {
            this.createToast(finalInfo);
        }
    }
    error(info = {}) {
        const defaultInfo = {
            position: 'top-right',
            dismissable: false,
            title: "Crash Landing",
            description: 'That didn’t go as expected. Let’s debug',
            duration: 3000,
            showProgress: true,
            icon: {
                name: 'triangular_error',
                size: 30,
                color: undefined,
            },
        };
        const finalInfo = Object.assign(Object.assign(Object.assign({}, defaultInfo), info), { icon: Object.assign(Object.assign({}, defaultInfo.icon), info.icon) });
        if (this.positions.find((position) => position == finalInfo.position)) {
            this.createToast(finalInfo);
        }
    }
    info(info = {}) {
        const defaultInfo = {
            position: 'top-right',
            dismissable: false,
            title: "Ping from the System",
            description: 'Nothing’s broken. Just keeping you informed',
            duration: 3000,
            showProgress: true,
            icon: {
                name: 'info_circle',
                size: 30,
                color: undefined,
            },
        };
        const finalInfo = Object.assign(Object.assign(Object.assign({}, defaultInfo), info), { icon: Object.assign(Object.assign({}, defaultInfo.icon), info.icon) });
        if (this.positions.find((position) => position == finalInfo.position)) {
            this.createToast(finalInfo);
        }
    }
    createToast(info) {
        var _a, _b, _c, _d, _e;
        var toast = document.createElement('toast');
        toast.setAttribute('class', `toast-element dark:bg-[#08090a] dark:border dark:border-[#222226] dark:text-white toast-${info.position}`);
        var toastContent = document.createElement('div');
        toastContent.setAttribute('class', 'content');
        // icon
        var icon = document.createElement('div');
        icon.setAttribute('class', 'icon');
        if ((_a = info.icon) === null || _a === void 0 ? void 0 : _a.color) {
            icon.style.color = info.icon.color;
        }
        var iconSvg = this.iconFinder.getIcon((_c = (_b = info.icon) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : '', (_d = info.icon) === null || _d === void 0 ? void 0 : _d.size);
        if (iconSvg) {
            icon.appendChild(iconSvg);
        }
        var contentWrapper = document.createElement('div');
        contentWrapper.setAttribute('class', 'content');
        // content
        var content = document.createElement('div');
        content.setAttribute('class', 'info');
        if (info && 'title' in info && 'description' in info) {
            content.innerHTML = `<h2>${info.title}</h2><p>${info.description}</p>`;
        }
        else {
            content.innerHTML = `<h2>Title</h2><p>Description</p>`;
        }
        contentWrapper.appendChild(icon);
        contentWrapper.appendChild(content);
        // is dismissable
        if (info.dismissable) {
            let closeBtn = document.createElement('button');
            closeBtn.className = 'dismiss-btn';
            var closeIcon = this.iconFinder.getIcon('cross');
            if (closeIcon) {
                closeBtn.appendChild(closeIcon);
            }
            contentWrapper.appendChild(closeBtn);
            closeBtn.addEventListener('click', () => {
                toast.classList.add('toast-removing');
                toast.addEventListener('animationend', () => {
                    toast.remove();
                });
            });
        }
        toast.appendChild(contentWrapper);
        //    if duration
        if (info.duration != false) {
            var timer = info.duration == true ? 3000 : info.duration;
            this.durationController(toast, timer !== null && timer !== void 0 ? timer : 3000, info.showProgress);
        }
        var stackElements = $$('#' + this.containerId + ' ' + '.' + 'toast-' + info.position);
        this.stackSize = this.stackSize < 2 ? 2 : this.stackSize;
        if (stackElements.length >= this.stackSize) {
            stackElements[0].remove();
        }
        var stack = $('#' + this.containerId + ' ' + '.' + info.position);
        if (stack) {
            stack.appendChild(toast);
        }
        var stackElements = $$('#' + this.containerId + ' ' + '.' + 'toast-' + info.position);
        this.styleStack(stackElements, (_e = info.position) !== null && _e !== void 0 ? _e : null);
    }
    durationController(toast, timer, showProgress) {
        if (showProgress) {
            // Create progress bar structure
            var progressBar = document.createElement('div');
            progressBar.setAttribute('class', 'duration-progress');
            var progress = document.createElement('div');
            progress.setAttribute('class', 'progress');
            progressBar.appendChild(progress);
            toast.appendChild(progressBar);
        }
        // Duration logic
        var startTime = Date.now();
        var remainingTime = timer;
        var elapsedTime = 0;
        var toastDurationId = Date.now();
        var isStop = false;
        function startDuration() {
            startTime = Date.now();
            if (showProgress) {
                // Reset width to current state before animating
                requestAnimationFrame(() => {
                    progress.style.transition = 'none'; // Remove previous transition
                    progress.style.transition = `width ${remainingTime}ms linear`;
                    progress.style.width = '0%';
                });
            }
            // Set timeout to remove toast
            toastDurationId = setTimeout(() => {
                toast.classList.add('toast-removing');
                toast.addEventListener('animationend', () => {
                    toast.remove();
                });
            }, remainingTime);
        }
        // Pause on hover
        toast.addEventListener('mouseover', () => {
            if (!isStop) {
                clearTimeout(toastDurationId);
                elapsedTime = Date.now() - startTime;
                remainingTime = remainingTime - elapsedTime;
                if (showProgress) {
                    const computedStyle = window.getComputedStyle(progress);
                    const currentWidth = computedStyle.width;
                    progress.style.transition = 'none';
                    progress.style.width = currentWidth;
                }
            }
            isStop = true;
        });
        // Resume on mouse leave
        toast.addEventListener('mouseleave', () => {
            isStop = false;
            startDuration();
        });
        // Start the duration initially
        startDuration();
    }
    styleStack(elements, position) {
        if (elements.length > 1) {
            elements.forEach((toast, index) => {
                if (elements.length != index + 1) {
                    if (position == 'top-right' || position == 'top-center' || position == 'top-left') {
                        var scaleValue = 1 - (elements.length - (index + 1)) / (elements.length * 5);
                        toast.style.position = "absolute";
                        toast.style.transform =
                            `scale(${scaleValue}) translateY(${((elements.length - (index + 1)) * 10) + scaleValue}px)`;
                    }
                }
            });
        }
    }
    attachListeners() {
        var toastStacks = $$('.toast-stack');
        toastStacks.forEach(stack => {
            stack.addEventListener('mouseenter', () => {
                var _a;
                var stackElements = Array.from((_a = stack.querySelectorAll('toast')) !== null && _a !== void 0 ? _a : []);
                stackElements.forEach((toast, toastIndex) => {
                    var _a;
                    var position = (_a = toast.parentElement) === null || _a === void 0 ? void 0 : _a.getAttribute('position');
                    const stackDimension = getY(stackElements, toastIndex);
                    toast.style.transform = `scale(1) translateY(${stackDimension.yValue}px)`;
                    stack.style.height = stackDimension.height + 'px';
                });
            });
        });
        toastStacks.forEach(stack => {
            stack.addEventListener('mouseleave', () => {
                var _a;
                var position = stack.getAttribute('position');
                var toasts = stack.querySelectorAll('toast');
                this.styleStack(stack.querySelectorAll('toast'), (_a = stack.getAttribute('position')) !== null && _a !== void 0 ? _a : null);
                stack.style.height = 'fit-content';
            });
        });
        function getY(stack, toastIndex) {
            var yValue = 0;
            var height = 0;
            stack.forEach((element, index) => {
                if (element instanceof Element) {
                    if (index > toastIndex) {
                        yValue += element.getBoundingClientRect().height + 20;
                    }
                }
                height += element.getBoundingClientRect().height;
            });
            return {
                yValue: yValue,
                height: height
            };
        }
    }
}
//# sourceMappingURL=index.js.map