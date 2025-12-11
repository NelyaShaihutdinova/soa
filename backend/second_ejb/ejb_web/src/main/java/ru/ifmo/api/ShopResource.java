package ru.ifmo.api;

import jakarta.ejb.EJB;
import jakarta.validation.constraints.Min;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import ru.ifmo.external.model.Error;
import ru.ifmo.service.DictionaryProcessingRemote;

@Path("/shop")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ShopResource {

    @EJB
    private DictionaryProcessingRemote dictionaryProcessingRemote;

    @GET
    @Path("/search/by-engine-power/{from}/{to}")
    public Response searchByEnginePower(
            @PathParam("from") @Min(1) Integer from,
            @PathParam("to") @Min(1) Integer to) {
        try {
            var vehicles = dictionaryProcessingRemote.searchVehiclesByEnginePower(from, to);
            return Response.ok(vehicles)
                    .build();
        } catch (RuntimeException e) {
            return errorResponse(404, "Vehicle wasn't found");
        }
    }

    @PATCH
    @Path("/add-wheels/{vehicle-id}/{number-of-wheels}")
    public Response addWheels(
            @PathParam("vehicle-id") @Min(1) Integer vehicleId,
            @PathParam("number-of-wheels") @Min(1) Integer wheels) {
        try {
            var vehicles = dictionaryProcessingRemote.addWheelsToVehicle(vehicleId, wheels);
            return Response.ok(vehicles)
                    .build();
        } catch (RuntimeException e) {
            return errorResponse(404, "Vehicle wasn't found");
        }
    }

    private Response errorResponse(int code, String message) {
        var error = new Error();
        error.setTimestamp(java.time.OffsetDateTime.now());
        error.setStatus(code);
        error.setMessage(message);
        return Response.status(code).entity(error).build();
    }
}