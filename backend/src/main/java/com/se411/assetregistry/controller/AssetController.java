package com.se411.assetregistry.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.se411.assetregistry.dto.AssetPageResponse;
import com.se411.assetregistry.model.Asset;
import com.se411.assetregistry.service.AssetService;

// REST API for assets. The React app (Vite runs it on port 5173) calls these routes.
@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "http://localhost:5173")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    // POST /api/assets -> add an asset
    @PostMapping
    public ResponseEntity<Asset> addAsset(@RequestBody Asset asset) {
        Asset saved = assetService.addAsset(asset);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // GET /api/assets/{id} -> search an asset by id
    @GetMapping("/{id}")
    public Asset getAssetById(@PathVariable("id") Long id) {
        return assetService.findById(id);
    }

    // GET /api/assets?page=0&size=5 -> all assets, one page at a time
    @GetMapping
    public AssetPageResponse getAllAssets(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size) {
        Page<Asset> result = assetService.findAll(page, size);
        return new AssetPageResponse(
                result.getContent(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages());
    }

    // PUT /api/assets/{id} -> update an asset
    @PutMapping("/{id}")
    public Asset updateAsset(@PathVariable("id") Long id, @RequestBody Asset asset) {
        return assetService.updateAsset(id, asset);
    }

    // DELETE /api/assets/{id} -> delete an asset
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAsset(@PathVariable("id") Long id) {
        assetService.deleteAsset(id);
        return ResponseEntity.noContent().build();
    }
}
