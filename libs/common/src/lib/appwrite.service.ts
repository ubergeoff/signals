import { Client } from 'appwrite';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppwriteService {
    private _client: Client;
    constructor() {
        this._client = new Client();

        this._client
            .setEndpoint('https://cloud.appwrite.io/v1')
            .setProject('652a7babc2bcb78d4b3a');
    }

    client(): Client {
        return this._client;
    }
}
