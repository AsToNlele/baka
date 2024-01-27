/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/api/users/": {
    /** @description API endpoint that allows users to be viewed or edited. */
    get: operations["listUsers"];
  };
  "/api/users/me/": {
    /** @description API endpoint that allows users to be viewed or edited. */
    get: operations["meUser"];
  };
  "/api/users/{id}/": {
    /** @description API endpoint that allows users to be viewed or edited. */
    get: operations["retrieveUser"];
  };
  "/api/profiles/": {
    /** @description API endpoint that allows groups to be viewed or edited. */
    get: operations["listProfiles"];
    /** @description API endpoint that allows groups to be viewed or edited. */
    post: operations["createProfile"];
  };
  "/api/profiles/{id}/": {
    /** @description API endpoint that allows groups to be viewed or edited. */
    get: operations["retrieveProfile"];
    /** @description API endpoint that allows groups to be viewed or edited. */
    put: operations["updateProfile"];
    /** @description API endpoint that allows groups to be viewed or edited. */
    delete: operations["destroyProfile"];
    /** @description API endpoint that allows groups to be viewed or edited. */
    patch: operations["partialUpdateProfile"];
  };
  "/api/groups/": {
    /** @description API endpoint that allows groups to be viewed or edited. */
    get: operations["listGroups"];
    /** @description API endpoint that allows groups to be viewed or edited. */
    post: operations["createGroup"];
  };
  "/api/groups/{id}/": {
    /** @description API endpoint that allows groups to be viewed or edited. */
    get: operations["retrieveGroup"];
    /** @description API endpoint that allows groups to be viewed or edited. */
    put: operations["updateGroup"];
    /** @description API endpoint that allows groups to be viewed or edited. */
    delete: operations["destroyGroup"];
    /** @description API endpoint that allows groups to be viewed or edited. */
    patch: operations["partialUpdateGroup"];
  };
  "/api/books/": {
    get: operations["listBooks"];
    post: operations["createBook"];
  };
  "/api/books/{id}/": {
    get: operations["retrieveBook"];
    put: operations["updateBook"];
    delete: operations["destroyBook"];
    patch: operations["partialUpdateBook"];
  };
  "/api/greenhouses/": {
    get: operations["listGreenhouses"];
    post: operations["createGreenhouse"];
  };
  "/api/greenhouses/{id}/": {
    get: operations["retrieveGreenhouse"];
    put: operations["updateGreenhouse"];
    delete: operations["destroyGreenhouse"];
    patch: operations["partialUpdateGreenhouse"];
  };
  "/api/auth/profile": {
    get: operations["listUsers"];
  };
  "/api/auth/login": {
    post: operations["createLogin"];
  };
  "/api/auth/register": {
    post: operations["createRegister"];
  };
  "/api/auth/logout": {
    post: operations["createLogout"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    User: {
      first_name?: string;
      last_name?: string;
      /** @description Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
      username: string;
      /** Format: email */
      email?: string;
      groups?: readonly string[];
      profile?: {
        readonly id?: number;
        readonly user: number;
      };
    };
    Profile: {
      id?: number;
      user: number;
    };
    Group: {
      url?: string;
      name: string;
    };
    Book: {
      id?: number;
      title: string;
      author: string;
      profile?: number | null;
    };
    Greenhouse: {
      url?: string;
      greenhouse_address: {
        id?: number;
        country?: string | null;
        state?: string | null;
        city?: string | null;
        city_part?: string | null;
        street?: string | null;
        zipcode?: string | null;
        latitude?: string | null;
        longitude?: string | null;
      };
      title?: string | null;
      description?: string | null;
      rules?: string | null;
      published?: boolean | null;
      owner?: string | null;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export interface operations {

  listUsers: {
    responses: {
      200: {
        content: {
          "application/json": unknown[];
        };
      };
    };
  };
  /** @description API endpoint that allows users to be viewed or edited. */
  meUser: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["User"];
        };
      };
    };
  };
  /** @description API endpoint that allows users to be viewed or edited. */
  retrieveUser: {
    parameters: {
      path: {
        /** @description A unique integer value identifying this user. */
        id: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["User"];
        };
      };
    };
  };
  /** @description API endpoint that allows groups to be viewed or edited. */
  listProfiles: {
    parameters: {
      query?: {
        /** @description A page number within the paginated result set. */
        page?: number;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": {
            /** @example 123 */
            count?: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=4
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=2
             */
            previous?: string | null;
            results?: components["schemas"]["Profile"][];
          };
        };
      };
    };
  };
  /** @description API endpoint that allows groups to be viewed or edited. */
  createProfile: {
    requestBody?: {
      content: {
        "application/json": components["schemas"]["Profile"];
        "application/x-www-form-urlencoded": components["schemas"]["Profile"];
        "multipart/form-data": components["schemas"]["Profile"];
      };
    };
    responses: {
      201: {
        content: {
          "application/json": components["schemas"]["Profile"];
        };
      };
    };
  };
  /** @description API endpoint that allows groups to be viewed or edited. */
  retrieveProfile: {
    parameters: {
      path: {
        /** @description A unique integer value identifying this profile. */
        id: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["Profile"];
        };
      };
    };
  };
  /** @description API endpoint that allows groups to be viewed or edited. */
  updateProfile: {
    parameters: {
      path: {
        /** @description A unique integer value identifying this profile. */
        id: string;
      };
    };
    requestBody?: {
      content: {
        "application/json": components["schemas"]["Profile"];
        "application/x-www-form-urlencoded": components["schemas"]["Profile"];
        "multipart/form-data": components["schemas"]["Profile"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["Profile"];
        };
      };
    };
  };
  /** @description API endpoint that allows groups to be viewed or edited. */
  destroyProfile: {
    parameters: {
      path: {
        /** @description A unique integer value identifying this profile. */
        id: string;
      };
    };
    responses: {
      204: {
        content: never;
      };
    };
  };
  /** @description API endpoint that allows groups to be viewed or edited. */
  partialUpdateProfile: {
    parameters: {
      path: {
        /** @description A unique integer value identifying this profile. */
        id: string;
      };
    };
    requestBody?: {
      content: {
        "application/json": components["schemas"]["Profile"];
        "application/x-www-form-urlencoded": components["schemas"]["Profile"];
        "multipart/form-data": components["schemas"]["Profile"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["Profile"];
        };
      };
    };
  };
  /** @description API endpoint that allows groups to be viewed or edited. */
  listGroups: {
    parameters: {
      query?: {
        /** @description A page number within the paginated result set. */
        page?: number;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": {
            /** @example 123 */
            count?: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=4
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=2
             */
            previous?: string | null;
            results?: components["schemas"]["Group"][];
          };
        };
      };
    };
  };
  /** @description API endpoint that allows groups to be viewed or edited. */
  createGroup: {
    requestBody?: {
      content: {
        "application/json": components["schemas"]["Group"];
        "application/x-www-form-urlencoded": components["schemas"]["Group"];
        "multipart/form-data": components["schemas"]["Group"];
      };
    };
    responses: {
      201: {
        content: {
          "application/json": components["schemas"]["Group"];
        };
      };
    };
  };
  /** @description API endpoint that allows groups to be viewed or edited. */
  retrieveGroup: {
    parameters: {
      path: {
        /** @description A unique integer value identifying this group. */
        id: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["Group"];
        };
      };
    };
  };
  /** @description API endpoint that allows groups to be viewed or edited. */
  updateGroup: {
    parameters: {
      path: {
        /** @description A unique integer value identifying this group. */
        id: string;
      };
    };
    requestBody?: {
      content: {
        "application/json": components["schemas"]["Group"];
        "application/x-www-form-urlencoded": components["schemas"]["Group"];
        "multipart/form-data": components["schemas"]["Group"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["Group"];
        };
      };
    };
  };
  /** @description API endpoint that allows groups to be viewed or edited. */
  destroyGroup: {
    parameters: {
      path: {
        /** @description A unique integer value identifying this group. */
        id: string;
      };
    };
    responses: {
      204: {
        content: never;
      };
    };
  };
  /** @description API endpoint that allows groups to be viewed or edited. */
  partialUpdateGroup: {
    parameters: {
      path: {
        /** @description A unique integer value identifying this group. */
        id: string;
      };
    };
    requestBody?: {
      content: {
        "application/json": components["schemas"]["Group"];
        "application/x-www-form-urlencoded": components["schemas"]["Group"];
        "multipart/form-data": components["schemas"]["Group"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["Group"];
        };
      };
    };
  };
  listBooks: {
    parameters: {
      query?: {
        /** @description A page number within the paginated result set. */
        page?: number;
        /** @description title */
        title?: string;
        /** @description author */
        author?: string;
        /** @description A search term. */
        search?: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": {
            /** @example 123 */
            count?: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=4
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=2
             */
            previous?: string | null;
            results?: components["schemas"]["Book"][];
          };
        };
      };
    };
  };
  createBook: {
    requestBody?: {
      content: {
        "application/json": components["schemas"]["Book"];
        "application/x-www-form-urlencoded": components["schemas"]["Book"];
        "multipart/form-data": components["schemas"]["Book"];
      };
    };
    responses: {
      201: {
        content: {
          "application/json": components["schemas"]["Book"];
        };
      };
    };
  };
  retrieveBook: {
    parameters: {
      query?: {
        /** @description title */
        title?: string;
        /** @description author */
        author?: string;
        /** @description A search term. */
        search?: string;
      };
      path: {
        /** @description A unique integer value identifying this book. */
        id: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["Book"];
        };
      };
    };
  };
  updateBook: {
    parameters: {
      query?: {
        /** @description title */
        title?: string;
        /** @description author */
        author?: string;
        /** @description A search term. */
        search?: string;
      };
      path: {
        /** @description A unique integer value identifying this book. */
        id: string;
      };
    };
    requestBody?: {
      content: {
        "application/json": components["schemas"]["Book"];
        "application/x-www-form-urlencoded": components["schemas"]["Book"];
        "multipart/form-data": components["schemas"]["Book"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["Book"];
        };
      };
    };
  };
  destroyBook: {
    parameters: {
      query?: {
        /** @description title */
        title?: string;
        /** @description author */
        author?: string;
        /** @description A search term. */
        search?: string;
      };
      path: {
        /** @description A unique integer value identifying this book. */
        id: string;
      };
    };
    responses: {
      204: {
        content: never;
      };
    };
  };
  partialUpdateBook: {
    parameters: {
      query?: {
        /** @description title */
        title?: string;
        /** @description author */
        author?: string;
        /** @description A search term. */
        search?: string;
      };
      path: {
        /** @description A unique integer value identifying this book. */
        id: string;
      };
    };
    requestBody?: {
      content: {
        "application/json": components["schemas"]["Book"];
        "application/x-www-form-urlencoded": components["schemas"]["Book"];
        "multipart/form-data": components["schemas"]["Book"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["Book"];
        };
      };
    };
  };
  listGreenhouses: {
    parameters: {
      query?: {
        /** @description A page number within the paginated result set. */
        page?: number;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": {
            /** @example 123 */
            count?: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=4
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=2
             */
            previous?: string | null;
            results?: components["schemas"]["Greenhouse"][];
          };
        };
      };
    };
  };
  createGreenhouse: {
    requestBody?: {
      content: {
        "application/json": components["schemas"]["Greenhouse"];
        "application/x-www-form-urlencoded": components["schemas"]["Greenhouse"];
        "multipart/form-data": components["schemas"]["Greenhouse"];
      };
    };
    responses: {
      201: {
        content: {
          "application/json": components["schemas"]["Greenhouse"];
        };
      };
    };
  };
  retrieveGreenhouse: {
    parameters: {
      path: {
        /** @description A unique integer value identifying this greenhouse. */
        id: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["Greenhouse"];
        };
      };
    };
  };
  updateGreenhouse: {
    parameters: {
      path: {
        /** @description A unique integer value identifying this greenhouse. */
        id: string;
      };
    };
    requestBody?: {
      content: {
        "application/json": components["schemas"]["Greenhouse"];
        "application/x-www-form-urlencoded": components["schemas"]["Greenhouse"];
        "multipart/form-data": components["schemas"]["Greenhouse"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["Greenhouse"];
        };
      };
    };
  };
  destroyGreenhouse: {
    parameters: {
      path: {
        /** @description A unique integer value identifying this greenhouse. */
        id: string;
      };
    };
    responses: {
      204: {
        content: never;
      };
    };
  };
  partialUpdateGreenhouse: {
    parameters: {
      path: {
        /** @description A unique integer value identifying this greenhouse. */
        id: string;
      };
    };
    requestBody?: {
      content: {
        "application/json": components["schemas"]["Greenhouse"];
        "application/x-www-form-urlencoded": components["schemas"]["Greenhouse"];
        "multipart/form-data": components["schemas"]["Greenhouse"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["Greenhouse"];
        };
      };
    };
  };
  createLogin: {
    requestBody?: {
      content: {
        "application/json": unknown;
        "application/x-www-form-urlencoded": unknown;
        "multipart/form-data": unknown;
      };
    };
    responses: {
      201: {
        content: {
          "application/json": unknown;
        };
      };
    };
  };
  createRegister: {
    requestBody?: {
      content: {
        "application/json": unknown;
        "application/x-www-form-urlencoded": unknown;
        "multipart/form-data": unknown;
      };
    };
    responses: {
      201: {
        content: {
          "application/json": unknown;
        };
      };
    };
  };
  createLogout: {
    requestBody?: {
      content: {
        "application/json": unknown;
        "application/x-www-form-urlencoded": unknown;
        "multipart/form-data": unknown;
      };
    };
    responses: {
      201: {
        content: {
          "application/json": unknown;
        };
      };
    };
  };
}