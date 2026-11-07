package com.se411.assetregistry.dto;

import java.util.List;

import com.se411.assetregistry.model.Asset;

// What the server sends back for GET /api/assets.
// It holds one page of assets plus the paging information.
public class AssetPageResponse {

    private List<Asset> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;

    public AssetPageResponse(List<Asset> content, int page, int size,
                             long totalElements, int totalPages) {
        this.content = content;
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
    }

    public List<Asset> getContent() {
        return content;
    }

    public int getPage() {
        return page;
    }

    public int getSize() {
        return size;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }
}
