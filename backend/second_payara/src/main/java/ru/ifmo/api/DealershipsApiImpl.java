package ru.ifmo.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import ru.ifmo.model.DealershipSearchRequest;
import ru.ifmo.model.DealershipSearchResult;

@RestController
public class DealershipsApiImpl implements DealershipsApi {

    @Override
    public ResponseEntity<DealershipSearchResult> dealershipsNearestWithVehiclePost(DealershipSearchRequest dealershipSearchRequest) {
        return DealershipsApi.super.dealershipsNearestWithVehiclePost(dealershipSearchRequest);
    }
}
