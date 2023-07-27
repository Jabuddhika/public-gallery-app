package lk.ijse.dep10.gallery.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletContext;
import javax.servlet.http.Part;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/images")
public class ImageController {

    @Autowired
    private ServletContext servletContext;
    @GetMapping
    public List<String> getAllImages(UriComponentsBuilder uriBuilder){
        List<String> imageUrlList =new ArrayList<>();
        String imgDirPath = servletContext.getRealPath("/images");
        File ImageDir = new File(imgDirPath);
        String[] imageFiles = ImageDir.list();
        for (String imageFileName : imageFiles) {
            UriComponentsBuilder uriComponentsBuilder = uriBuilder.cloneBuilder();
            String url =uriComponentsBuilder.pathSegment("images",imageFileName).toUriString();
            imageUrlList.add(url);
        }
        return  imageUrlList;


    }
    @GetMapping("/download")
    public String downloadImages(@RequestParam(name = "q") String imageUrl) {
        try {
            imageUrl="images/"+imageUrl;
            String realPath = servletContext.getRealPath(imageUrl);
            File file = new File(realPath);
            FileInputStream fis = new FileInputStream(file);
            byte[]bytes=new byte[(int)file.length()];
            fis.read(bytes);
            String base64Data = Base64.getEncoder().encodeToString(bytes);
            return base64Data;

        } catch (FileNotFoundException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }


    }
    @ResponseStatus(HttpStatus.OK)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<String> postImage(@RequestPart("images") List<Part> imageFiles,UriComponentsBuilder uriComponentsBuilder){
        List<String> imageUrlList =new ArrayList<>();
        if(imageFiles!=null){
            String imageDirPath = servletContext.getRealPath("/images");
            for (Part imageFile : imageFiles) {
                String imageFilePath = new File(imageDirPath, imageFile.getSubmittedFileName()).getAbsolutePath();
                try{
                    imageFile.write(imageFilePath);
                    UriComponentsBuilder cloneBuilder = uriComponentsBuilder.cloneBuilder();
                    String imagesLink = cloneBuilder.pathSegment("images", imageFile.getSubmittedFileName()).toUriString();
                    imageUrlList.add(imagesLink);
                } catch (IOException e) {
                    e.printStackTrace();
                    throw new RuntimeException(e);
                }
            }

        }
        return imageUrlList;
    }


    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{imageUrl}")
    public void deleteImage(@PathVariable String imageUrl){
        System.out.println("entered");
        imageUrl="images/"+imageUrl;
        String realPath = servletContext.getRealPath(imageUrl);
        File file = new File(realPath);
        if(!file.exists()){
            System.out.println("file not exists");
            return;
        }
        file.delete();
        System.out.println("file deleted");
    }
}



