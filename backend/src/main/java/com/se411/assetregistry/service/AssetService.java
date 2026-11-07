package com.se411.assetregistry.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.se411.assetregistry.exception.AssetNotFoundException;
import com.se411.assetregistry.model.Asset;
import com.se411.assetregistry.repository.AssetRepository;

// Business logic for assets. The controller calls this class,
// and this class calls the repository.
@Service
public class AssetService {

    private static final int DEFAULT_PAGE_SIZE = 5;

    private final AssetRepository assetRepository;

    public AssetService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    // Add a new asset. The id is set to null so the database creates a new one.
    public Asset addAsset(Asset asset) {
        asset.setId(null);
        return assetRepository.save(asset);
    }

    // Find one asset by id, or throw an exception if it does not exist.
    public Asset findById(Long id) {
        return assetRepository.findById(id)
                .orElseThrow(() -> new AssetNotFoundException(id));
    }

    // Get one page of assets, sorted by id.
    public Page<Asset> findAll(int page, int size) {
        if (page < 0) {
            page = 0;
        }
        if (size < 1) {
            size = DEFAULT_PAGE_SIZE;
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by("id"));
        return assetRepository.findAll(pageable);
    }

    // Update an existing asset with the new values.
    public Asset updateAsset(Long id, Asset newData) {
        Asset existing = findById(id);
        existing.setName(newData.getName());
        existing.setBrand(newData.getBrand());
        existing.setSerialNumber(newData.getSerialNumber());
        existing.setPurchaseDate(newData.getPurchaseDate());
        existing.setPrice(newData.getPrice());
        existing.setStatus(newData.getStatus());
        return assetRepository.save(existing);
    }

    // Delete an asset. Kept so the Delete button from Part 1 still works.
    public void deleteAsset(Long id) {
        Asset existing = findById(id);
        assetRepository.delete(existing);
    }
}
