package com.se411.assetregistry.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.se411.assetregistry.exception.AssetNotFoundException;
import com.se411.assetregistry.model.Asset;
import com.se411.assetregistry.service.AssetService;

// Tests for the REST routes. Only the web layer is started,
// and AssetService is replaced by a Mockito mock.
@WebMvcTest(AssetController.class)
class AssetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AssetService assetService;

    private Asset dell;
    private Asset mac;

    private final String assetJson = """
            {
              "name": "Dell Latitude",
              "brand": "Dell",
              "serialNumber": "D-1",
              "purchaseDate": "2024-01-01",
              "price": 1000,
              "status": "In use"
            }
            """;

    @BeforeEach
    void setUp() {
        dell = new Asset("Dell Latitude", "Dell", "D-1", LocalDate.of(2024, 1, 1), 1000, "In use");
        dell.setId(1L);
        mac = new Asset("MacBook Pro", "Apple", "A-2", LocalDate.of(2024, 2, 2), 2000, "In stock");
        mac.setId(2L);
    }

    @Test
    void postAddsAnAssetAndReturns201() throws Exception {
        when(assetService.addAsset(any(Asset.class))).thenReturn(dell);

        mockMvc.perform(post("/api/assets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(assetJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Dell Latitude"))
                .andExpect(jsonPath("$.brand").value("Dell"))
                .andExpect(jsonPath("$.serialNumber").value("D-1"))
                .andExpect(jsonPath("$.purchaseDate").value("2024-01-01"))
                .andExpect(jsonPath("$.price").value(1000.0))
                .andExpect(jsonPath("$.status").value("In use"));

        verify(assetService).addAsset(any(Asset.class));
    }

    @Test
    void getByIdReturnsTheAsset() throws Exception {
        when(assetService.findById(1L)).thenReturn(dell);

        mockMvc.perform(get("/api/assets/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Dell Latitude"));
    }

    @Test
    void getByIdReturns404WhenTheAssetDoesNotExist() throws Exception {
        when(assetService.findById(99L)).thenThrow(new AssetNotFoundException(99L));

        mockMvc.perform(get("/api/assets/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAllReturnsAPageOfAssets() throws Exception {
        Page<Asset> page = new PageImpl<>(List.of(dell, mac), PageRequest.of(0, 2), 5);
        when(assetService.findAll(0, 2)).thenReturn(page);

        mockMvc.perform(get("/api/assets").param("page", "0").param("size", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.content[0].name").value("Dell Latitude"))
                .andExpect(jsonPath("$.content[1].name").value("MacBook Pro"))
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(2))
                .andExpect(jsonPath("$.totalElements").value(5))
                .andExpect(jsonPath("$.totalPages").value(3));
    }

    @Test
    void getAllUsesPage0AndSize5ByDefault() throws Exception {
        Page<Asset> page = new PageImpl<>(List.of(dell, mac), PageRequest.of(0, 5), 2);
        when(assetService.findAll(0, 5)).thenReturn(page);

        mockMvc.perform(get("/api/assets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalPages").value(1));

        verify(assetService).findAll(0, 5);
    }

    @Test
    void putUpdatesTheAsset() throws Exception {
        Asset updated = new Asset("Dell XPS", "Dell", "D-1", LocalDate.of(2024, 1, 1), 1500, "In repair");
        updated.setId(1L);
        when(assetService.updateAsset(eq(1L), any(Asset.class))).thenReturn(updated);

        mockMvc.perform(put("/api/assets/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(assetJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Dell XPS"))
                .andExpect(jsonPath("$.status").value("In repair"));

        verify(assetService).updateAsset(eq(1L), any(Asset.class));
    }

    @Test
    void putReturns404WhenTheAssetDoesNotExist() throws Exception {
        when(assetService.updateAsset(eq(99L), any(Asset.class)))
                .thenThrow(new AssetNotFoundException(99L));

        mockMvc.perform(put("/api/assets/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(assetJson))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteReturns204() throws Exception {
        mockMvc.perform(delete("/api/assets/1"))
                .andExpect(status().isNoContent());

        verify(assetService).deleteAsset(1L);
    }

    @Test
    void deleteReturns404WhenTheAssetDoesNotExist() throws Exception {
        doThrow(new AssetNotFoundException(99L)).when(assetService).deleteAsset(99L);

        mockMvc.perform(delete("/api/assets/99"))
                .andExpect(status().isNotFound());
    }
}
