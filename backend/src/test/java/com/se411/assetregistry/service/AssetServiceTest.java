package com.se411.assetregistry.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.se411.assetregistry.exception.AssetNotFoundException;
import com.se411.assetregistry.model.Asset;
import com.se411.assetregistry.repository.AssetRepository;

// Unit tests for AssetService. The repository is a Mockito mock,
// so no database is used here.
@ExtendWith(MockitoExtension.class)
class AssetServiceTest {

    @Mock
    private AssetRepository assetRepository;

    @InjectMocks
    private AssetService assetService;

    private Asset dell;

    @BeforeEach
    void setUp() {
        dell = new Asset("Dell Latitude", "Dell", "D-1", LocalDate.of(2024, 1, 1), 1000, "In use");
        dell.setId(1L);
    }

    @Test
    void addAssetSavesAndReturnsTheNewAsset() {
        Asset input = new Asset("HP ProBook", "HP", "HP-77", LocalDate.of(2025, 3, 4), 800, "In stock");
        Asset saved = new Asset("HP ProBook", "HP", "HP-77", LocalDate.of(2025, 3, 4), 800, "In stock");
        saved.setId(10L);
        when(assetRepository.save(input)).thenReturn(saved);

        Asset result = assetService.addAsset(input);

        assertEquals(10L, result.getId());
        assertEquals("HP ProBook", result.getName());
        verify(assetRepository).save(input);
    }

    @Test
    void addAssetIgnoresAnIdSentByTheClient() {
        Asset input = new Asset("HP ProBook", "HP", "HP-77", LocalDate.of(2025, 3, 4), 800, "In stock");
        input.setId(99L);
        when(assetRepository.save(any(Asset.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Asset result = assetService.addAsset(input);

        assertNull(result.getId());
    }

    @Test
    void findByIdReturnsTheAsset() {
        when(assetRepository.findById(1L)).thenReturn(Optional.of(dell));

        Asset result = assetService.findById(1L);

        assertEquals("Dell Latitude", result.getName());
        assertEquals("D-1", result.getSerialNumber());
    }

    @Test
    void findByIdThrowsWhenTheAssetDoesNotExist() {
        when(assetRepository.findById(99L)).thenReturn(Optional.empty());

        AssetNotFoundException error = assertThrows(AssetNotFoundException.class,
                () -> assetService.findById(99L));

        assertEquals("Asset not found with id 99", error.getMessage());
    }

    @Test
    void findAllReturnsOnePageSortedById() {
        Page<Asset> page = new PageImpl<>(List.of(dell), PageRequest.of(0, 5), 1);
        when(assetRepository.findAll(any(Pageable.class))).thenReturn(page);

        Page<Asset> result = assetService.findAll(0, 5);

        ArgumentCaptor<Pageable> captor = ArgumentCaptor.forClass(Pageable.class);
        verify(assetRepository).findAll(captor.capture());
        Pageable used = captor.getValue();
        assertEquals(0, used.getPageNumber());
        assertEquals(5, used.getPageSize());
        assertEquals(Sort.by("id"), used.getSort());

        assertEquals(1, result.getTotalElements());
        assertEquals("Dell Latitude", result.getContent().get(0).getName());
    }

    @Test
    void findAllFixesANegativePageAndAZeroSize() {
        Page<Asset> page = new PageImpl<>(List.of(dell), PageRequest.of(0, 5), 1);
        when(assetRepository.findAll(any(Pageable.class))).thenReturn(page);

        assetService.findAll(-3, 0);

        ArgumentCaptor<Pageable> captor = ArgumentCaptor.forClass(Pageable.class);
        verify(assetRepository).findAll(captor.capture());
        assertEquals(0, captor.getValue().getPageNumber());
        assertEquals(5, captor.getValue().getPageSize());
    }

    @Test
    void updateAssetChangesAllFieldsAndSaves() {
        Asset newData = new Asset("Dell XPS", "Dell", "D-2", LocalDate.of(2025, 5, 5), 1500, "In repair");
        when(assetRepository.findById(1L)).thenReturn(Optional.of(dell));
        when(assetRepository.save(any(Asset.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Asset result = assetService.updateAsset(1L, newData);

        assertEquals(1L, result.getId());
        assertEquals("Dell XPS", result.getName());
        assertEquals("D-2", result.getSerialNumber());
        assertEquals(LocalDate.of(2025, 5, 5), result.getPurchaseDate());
        assertEquals(1500, result.getPrice());
        assertEquals("In repair", result.getStatus());
        verify(assetRepository).save(dell);
    }

    @Test
    void updateAssetThrowsAndDoesNotSaveWhenTheAssetDoesNotExist() {
        Asset newData = new Asset("Dell XPS", "Dell", "D-2", LocalDate.of(2025, 5, 5), 1500, "In repair");
        when(assetRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(AssetNotFoundException.class, () -> assetService.updateAsset(99L, newData));

        verify(assetRepository, never()).save(any(Asset.class));
    }

    @Test
    void deleteAssetDeletesTheAsset() {
        when(assetRepository.findById(1L)).thenReturn(Optional.of(dell));

        assetService.deleteAsset(1L);

        verify(assetRepository).delete(dell);
    }

    @Test
    void deleteAssetThrowsWhenTheAssetDoesNotExist() {
        when(assetRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(AssetNotFoundException.class, () -> assetService.deleteAsset(99L));

        verify(assetRepository, never()).delete(any(Asset.class));
    }
}
