"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateReadTime = exports.makeExcerptFromMarkdownOrHtml = exports.sanitizeUserHtml = exports.markdownToSanitizedHtml = void 0;
const showdown_1 = __importDefault(require("showdown"));
const reading_time_1 = __importDefault(require("reading-time"));
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const sanitizeOptions = {
    allowedTags: sanitize_html_1.default.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'figure', 'figcaption', 'iframe']),
    allowedAttributes: {
        a: ['href', 'name', 'target', 'rel'],
        img: ['src', 'alt', 'title', 'loading'],
        iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen']
    },
    allowedSchemes: ['http', 'https', 'data', 'mailto']
};
// showdown converter তৈরি
const converter = new showdown_1.default.Converter();
const markdownToSanitizedHtml = async (markdown) => {
    const rawHtml = converter.makeHtml(markdown || "");
    return (0, sanitize_html_1.default)(rawHtml, sanitizeOptions);
};
exports.markdownToSanitizedHtml = markdownToSanitizedHtml;
const sanitizeUserHtml = async (html) => {
    return (0, sanitize_html_1.default)(html || "", sanitizeOptions);
};
exports.sanitizeUserHtml = sanitizeUserHtml;
const makeExcerptFromMarkdownOrHtml = async (content, contentType, max = 160) => {
    let text = "";
    if (contentType === "markdown") {
        const html = converter.makeHtml(content);
        text = html.replace(/(<([^>]+)>)/gi, "");
    }
    else {
        text = (content || "").replace(/(<([^>]+)>)/gi, "");
    }
    text = text.replace(/\s+/g, " ").trim();
    return text.slice(0, max);
};
exports.makeExcerptFromMarkdownOrHtml = makeExcerptFromMarkdownOrHtml;
const calculateReadTime = async (content, contentType) => {
    let plain = "";
    if (contentType === "markdown") {
        const html = converter.makeHtml(content);
        plain = html.replace(/(<([^>]+)>)/gi, "");
    }
    else {
        plain = (content || "").replace(/(<([^>]+)>)/gi, "");
    }
    return (0, reading_time_1.default)(plain).text;
};
exports.calculateReadTime = calculateReadTime;
