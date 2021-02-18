import { backendDomain } from "./objects";
import { EditorState, convertFromRaw } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";

export default function buildRequest(url, queryData) {
    const urlWithDomain = backendDomain + url;
    if (!queryData) {
        return urlWithDomain;
    }

    let query = '?';
    for (let prop in queryData) {
        query += `${prop}=${queryData[prop]}&`
    }
    return urlWithDomain + query.substring(0, query.length - 1);
};

export const tryRenderRichTextFromRawJSON = (textBody) => {
    try { EditorState.createWithContent(convertFromRaw(JSON.parse(textBody))) }
    catch {
        return textBody
    }
    return <div style={{position: "relative", zIndex: "0"}}><Editor
        toolbarHidden={true}
        editorState={EditorState?.createWithContent(convertFromRaw(JSON.parse(textBody) || null)) || null}
        readOnly={true}
    /></div>
}