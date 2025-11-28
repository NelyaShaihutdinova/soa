package ru.ifmo.api;

import jakarta.ejb.EJB;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import ru.ifmo.external.model.Error;
import ru.ifmo.service.DictionaryProcessingRemote;

@Path("/vehicles")
@Produces(MediaType.APPLICATION_JSON)
public class VehiclesResource {

    @EJB
    private DictionaryProcessingRemote dictionaryProcessingRemote;

    @GET
    @Path("/search/by-coordinates")
    public Response searchByCoordinates(
            @QueryParam("x") @NotNull Long x,
            @QueryParam("y") @NotNull Integer y,
            @QueryParam("max_distance") @NotNull Integer maxDistance) {
        try {
            var response = dictionaryProcessingRemote.searchVehiclesByCoordinates(x, y, maxDistance);
            return Response.ok(response).build();
        } catch (RuntimeException e) {
            return errorResponse(500, "Internal error");
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