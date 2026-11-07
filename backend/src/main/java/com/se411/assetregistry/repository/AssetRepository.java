package com.se411.assetregistry.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.se411.assetregistry.model.Asset;

// Spring Data creates the implementation at runtime.
// JpaRepository already gives us save, findById, findAll(Pageable) and delete.
@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
}
