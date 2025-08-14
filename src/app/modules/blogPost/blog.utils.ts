import showdown from 'showdown';
import readingTime from 'reading-time';
import sanitizeHtml from "sanitize-html";

const sanitizeOptions: sanitizeHtml.IOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'figure', 'figcaption', 'iframe']),
    allowedAttributes: {
        a: ['href', 'name', 'target', 'rel'],
        img: ['src', 'alt', 'title', 'loading'],
        iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen']
    },
    allowedSchemes: ['http', 'https', 'data', 'mailto']
};

// showdown converter তৈরি
const converter = new showdown.Converter();

export const markdownToSanitizedHtml = async (markdown: string) => {
    const rawHtml = converter.makeHtml(markdown || "");
    return sanitizeHtml(rawHtml, sanitizeOptions);
};

export const sanitizeUserHtml = async (html: string) => {
    return sanitizeHtml(html || "", sanitizeOptions);
};

export const makeExcerptFromMarkdownOrHtml = async (content: string, contentType: "markdown" | "html", max: number = 160) => {
    let text = "";
    if (contentType === "markdown") {
        const html = converter.makeHtml(content);
        text = html.replace(/(<([^>]+)>)/gi, "");
    } else {
        text = (content || "").replace(/(<([^>]+)>)/gi, "");
    }
    text = text.replace(/\s+/g, " ").trim();
    return text.slice(0, max);
};

export const calculateReadTime = async (content: string, contentType: "markdown" | "html") => {
    let plain = "";
    if (contentType === "markdown") {
        const html = converter.makeHtml(content);
        plain = html.replace(/(<([^>]+)>)/gi, "");
    } else {
        plain = (content || "").replace(/(<([^>]+)>)/gi, "");
    }
    return readingTime(plain).text;
};
