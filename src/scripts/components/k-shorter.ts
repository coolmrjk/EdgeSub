import type { Form } from "./k-form";
import { getDefaultBackend } from "@scripts/utils/getDefaultBackend";

export class Shorter extends HTMLElement {
    defaultBackend = getDefaultBackend();
    constructor () {
        super();
        this.Elements.SubmitButton.addEventListener("click", () => {this.SubmitShorterRequest()})
    }
    async SubmitShorterRequest () {
        // build request body
        let requestBody = {
            subdata: this.Elements.subdata.get(),
            slug: this.Elements.slug.get(),
            password: this.Elements.password.get(),
        }

        // build api Endpoint
        let requestURL = new URL(this.defaultBackend);
        requestURL.pathname = "/short/put";

        await fetch(requestURL, {
            body: JSON.stringify(requestBody),
            method: "POST"
        }).then(async res => {
            // handle non-success request
            if (res.status !== 200) throw await res.text();
            // parse returned data as json
            return res.json()
        }).then(res => {
            this.Elements.Msg.innerText = `short:${res.slug}`;
            // sync slug and password with reponse
            this.Elements.slug.set(res.slug);
            this.Elements.password.set(res.password);
        }).catch((err) => {
            this.Elements.Msg.innerText = `提交失败: ${err}`;
        })
    }
    Elements = {
        subdata: this.querySelector("k-form#SubURL") as Form,

        slug: this.querySelector("k-form#short-slug") as Form,
        password: this.querySelector("k-form#short-password") as Form,

        Msg: this.querySelector("code"),
        SubmitButton: this.querySelector("#shorter"),
    }
}

customElements.define("k-shorter", Shorter);
console.info("[k-shorter] registered")

