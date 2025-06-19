package com.example.HotelBooking.services.impl;

import com.example.HotelBooking.dtos.Response;
import com.example.HotelBooking.dtos.RoomDTO;
import com.example.HotelBooking.entities.Room;
import com.example.HotelBooking.enums.RoomType;
import com.example.HotelBooking.exceptions.InvalidBookingStateAndDateException;
import com.example.HotelBooking.exceptions.NotFoundException;
import com.example.HotelBooking.repositories.RoomRepository;
import com.example.HotelBooking.services.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {


    private final RoomRepository roomRepository;
    private final ModelMapper modelMapper;

//    private static final String IMAGE_DIRECTORY = System.getProperty("user.dir") + "/product-image/";

    //image directory for our frontens appp
    private static final String IMAGE_DIRECTORY_FRONTEND = "/Users/dennismac/phegonDev/hotel-react-frontend/public/rooms/";



    @Override
    public Response addRoom(RoomDTO roomDTO, MultipartFile imageFile) {

        Room roomToSave = modelMapper.map(roomDTO, Room.class);

        if (imageFile != null){
            String imagePath = saveImageToFrontend(imageFile);
            roomToSave.setImageUrl(imagePath);
        }

        roomRepository.save(roomToSave);

        return Response.builder()
                .status(200)
                .message("Room successfully added")
                .build();
    }

    @Override
    public Response updateRoom(RoomDTO roomDTO, MultipartFile imageFile) {
        Room existingRoom = roomRepository.findById(roomDTO.getId())
                .orElseThrow(()-> new NotFoundException("Room not found"));

        if (imageFile != null && !imageFile.isEmpty()){
            String imagePath = saveImageToFrontend(imageFile);
            existingRoom.setImageUrl(imagePath);
        }

        if (roomDTO.getRoomNumber() != null && roomDTO.getRoomNumber() >= 0){
            existingRoom.setRoomNumber(roomDTO.getRoomNumber());
        }

        if (roomDTO.getPricePerNight() != null && roomDTO.getPricePerNight().compareTo(BigDecimal.ZERO) >= 0){
            existingRoom.setPricePerNight(roomDTO.getPricePerNight());
        }

        if (roomDTO.getCapacity() != null && roomDTO.getCapacity() > 0){
            existingRoom.setCapacity(roomDTO.getCapacity());
        }
        if (roomDTO.getType() != null) existingRoom.setType(roomDTO.getType());

        if(roomDTO.getDescription() != null) existingRoom.setDescription(roomDTO.getDescription());

        roomRepository.save(existingRoom);

        return Response.builder()
                .status(200)
                .message("Room updated successfully")
                .build();




    }

    @Override
    public Response getAllRooms() {

       List<Room> roomList = roomRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));

       List<RoomDTO> roomDTOList = modelMapper.map(roomList,new TypeToken<List<RoomDTO>>() {}.getType());

       return Response.builder()
               .status(200)
               .message("success")
               .rooms(roomDTOList)
               .build();
    }

    @Override
    public Response getRoomById(Long id) {

        Room room = roomRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Room not found"));

        RoomDTO roomDTO = modelMapper.map(room, RoomDTO.class);

        return Response.builder()
                .status(200)
                .message("success")
                .room(roomDTO)
                .build();
    }

    @Override
    public Response deleteRoom(Long id) {
        if (!roomRepository.existsById(id)){
            throw new NotFoundException("Room not found");
        }
        roomRepository.deleteById(id);

        return Response.builder()
                .status(200)
                .message("Room Deleted Successfully")
                .build();
    }

    @Override
    public Response getAvailableRooms(LocalDate checkInDate, LocalDate checkOutDate, RoomType roomType) {

        //validation: Ensure the check-in date is not before today
        if (checkInDate.isBefore(LocalDate.now())){
            throw new InvalidBookingStateAndDateException("check in date cannot be before today ");
        }

        //validation: Ensure the check-out date is not before check in date
        if (checkOutDate.isBefore(checkInDate)){
            throw new InvalidBookingStateAndDateException("check out date cannot be before check in date ");
        }

        //validation: Ensure the check-in date is not same as check out date
        if (checkInDate.isEqual(checkOutDate)){
            throw new InvalidBookingStateAndDateException("check in date cannot be equal to check out date ");
        }

        List<Room> roomList = roomRepository.findAvailableRooms(checkInDate, checkOutDate, roomType);

        List<RoomDTO> roomDTOList = modelMapper.map(roomList,new TypeToken<List<RoomDTO>>() {}.getType());

        return Response.builder()
                .status(200)
                .message("success")
                .rooms(roomDTOList)
                .build();
    }

    @Override
    public List<RoomType> getAllRoomTypes() {

        return Arrays.asList(RoomType.values());
    }

    @Override
    public Response searchRoom(String input) {

        List<Room> roomList = roomRepository.searchRooms(input);

        List<RoomDTO> roomDTOList = modelMapper.map(roomList,new TypeToken<List<RoomDTO>>() {}.getType());

        return Response.builder()
                .status(200)
                .message("success")
                .rooms(roomDTOList)
                .build();
    }





    //save image to backend folder

//    private String saveImage(MultipartFile imageFile){
//        if (!imageFile.getContentType().startsWith("image/")){
//            throw new IllegalArgumentException("Only Image files are allowed");
//        }
//
//        //Create directory to store image if it doesn exist
//        File directory = new File(IMAGE_DIRECTORY);
//
//        if (!directory.exists()){
//            directory.mkdir();
//        }
//        //Generate uniwue file name for the image
//        String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
//        //get the absolute path of the image
//        String  imagePath = IMAGE_DIRECTORY + uniqueFileName;
//
//        try {
//            File destinationFile = new File(imagePath);
//            imageFile.transferTo(destinationFile);
//        }catch (Exception ex){
//            throw  new IllegalArgumentException(ex.getMessage());
//        }
//
//        return imagePath;
//
//    }


    //save image to frontend folder
    private String saveImageToFrontend(MultipartFile imageFile){
        if (!imageFile.getContentType().startsWith("image/")){
            throw new IllegalArgumentException("Only Image files are allowed");
        }

        //Create directory to store image if it doesn exist
        File directory = new File(IMAGE_DIRECTORY_FRONTEND);

        if (!directory.exists()){
            directory.mkdir();
        }
        //Generate uniwue file name for the image
        String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
        //get the absolute path of the image
        String  imagePath = IMAGE_DIRECTORY_FRONTEND + uniqueFileName;

        try {
            File destinationFile = new File(imagePath);
            imageFile.transferTo(destinationFile);
        }catch (Exception ex){
            throw  new IllegalArgumentException(ex.getMessage());
        }

        return "/rooms/" + uniqueFileName;

    }
}
