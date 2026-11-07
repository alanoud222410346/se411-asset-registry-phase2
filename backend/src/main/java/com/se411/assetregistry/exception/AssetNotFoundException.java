package com.se411.assetregistry.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Thrown when there is no asset with the given id.
// Spring turns it into a 404 Not Found response.
@ResponseStatus(HttpStatus.NOT_FOUND)
public class AssetNotFoundException extends RuntimeException {

    public AssetNotFoundException(Long id) {
        super("Asset not found with id " + id);
    }
}
